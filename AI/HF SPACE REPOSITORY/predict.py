import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import joblib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator

ARTIFACTS        = "model_artifacts"
GENDER_CLASSES   = []
INTERNET_CLASSES = []
FEATURE_COLS     = []

_model   = None
_feat_sc = None
_tgt_sc  = None
_le_g    = None
_le_i    = None


class ResidualBlock(layers.Layer):
    def __init__(self, units, dropout_rate=0.15, **kwargs):
        super().__init__(**kwargs)
        self.units = units; self.dropout_rate = dropout_rate
        self.dense1  = layers.Dense(units, use_bias=False)
        self.bn1     = layers.BatchNormalization()
        self.act1    = layers.Activation("gelu")
        self.dropout = layers.Dropout(dropout_rate)
        self.dense2  = layers.Dense(units, use_bias=False)
        self.bn2     = layers.BatchNormalization()
        self.act_out = layers.Activation("gelu")
        self.projection = None

    def build(self, input_shape):
        if input_shape[-1] != self.units:
            self.projection = layers.Dense(self.units, use_bias=False)
        super().build(input_shape)

    def call(self, x, training=False):
        sc  = self.projection(x) if self.projection else x
        out = self.act1(self.bn1(self.dense1(x), training=training))
        out = self.dropout(out, training=training)
        out = self.bn2(self.dense2(out), training=training)
        return self.act_out(out + sc)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"units": self.units, "dropout_rate": self.dropout_rate})
        return cfg


class WeightedMultiOutputLoss(keras.losses.Loss):
    def __init__(self, w_prod=0.5, w_exam=0.5, delta=0.15, **kwargs):
        super().__init__(**kwargs)
        self.w_prod = w_prod; self.w_exam = w_exam; self.delta = delta
        self._huber = keras.losses.Huber(delta=delta, reduction="none")

    def call(self, y_true, y_pred):
        lp = tf.reduce_mean(self._huber(y_true[:, 0], y_pred[:, 0]))
        le = tf.reduce_mean(self._huber(y_true[:, 1], y_pred[:, 1]))
        return self.w_prod * lp + self.w_exam * le

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"w_prod": self.w_prod, "w_exam": self.w_exam, "delta": self.delta})
        return cfg


def load_artifacts():
    global _model, _feat_sc, _tgt_sc, _le_g, _le_i
    global FEATURE_COLS, GENDER_CLASSES, INTERNET_CLASSES

    _model   = tf.saved_model.load(os.path.join(ARTIFACTS, "saved_model"))
    _feat_sc = joblib.load(os.path.join(ARTIFACTS, "feat_scaler.pkl"))
    _tgt_sc  = joblib.load(os.path.join(ARTIFACTS, "tgt_scaler.pkl"))
    _le_g    = joblib.load(os.path.join(ARTIFACTS, "le_gender.pkl"))
    _le_i    = joblib.load(os.path.join(ARTIFACTS, "le_internet.pkl"))
    meta     = json.load(open(os.path.join(ARTIFACTS, "meta.json")))

    FEATURE_COLS     = meta["feature_cols"]
    GENDER_CLASSES   = meta["gender_classes"]
    INTERNET_CLASSES = meta["internet_classes"]


load_artifacts()

router = APIRouter()


class StudentFeatures(BaseModel):
    age:                  int   = Field(..., ge=10,  le=50,  example=20)
    gender:               str   = Field(...,         example="Male")
    study_hours:          float = Field(..., ge=0.0, le=24.0, example=6.0)
    self_study_hours:     float = Field(..., ge=0.0, le=24.0, example=2.0)
    online_classes_hours: float = Field(..., ge=0.0, le=24.0, example=3.0)
    social_media_hours:   float = Field(..., ge=0.0, le=24.0, example=2.0)
    gaming_hours:         float = Field(..., ge=0.0, le=24.0, example=1.0)
    sleep_hours:          float = Field(..., ge=0.0, le=24.0, example=7.5)
    screen_time_hours:    float = Field(..., ge=0.0, le=24.0, example=5.0)
    internet_quality:     str   = Field(...,         example="Good")
    mental_health_score:  int   = Field(..., ge=0,   le=100, example=72)
    focus_index:          int   = Field(..., ge=0,   le=100, example=78)
    burnout_level:        int   = Field(..., ge=0,   le=100, example=25)

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v):
        if v not in GENDER_CLASSES:
            raise ValueError(f"gender must be one of {GENDER_CLASSES}")
        return v

    @field_validator("internet_quality")
    @classmethod
    def validate_internet(cls, v):
        if v not in INTERNET_CLASSES:
            raise ValueError(f"internet_quality must be one of {INTERNET_CLASSES}")
        return v


class PredictionResponse(BaseModel):
    productivity_score: float
    exam_score:         float


class BatchRequest(BaseModel):
    students: list[StudentFeatures]


class BatchResponse(BaseModel):
    predictions: list[PredictionResponse]
    count:       int


def _predict_one(student: StudentFeatures) -> PredictionResponse:
    data = student.model_dump()
    data["gender"]           = int(_le_g.transform([data["gender"]])[0])
    data["internet_quality"] = int(_le_i.transform([data["internet_quality"]])[0])

    x      = np.array([[data[c] for c in FEATURE_COLS]], dtype=np.float32)
    x_sc   = _feat_sc.transform(x).astype(np.float32)
    y_norm = _model.serve(x_sc).numpy()
    y_orig = _tgt_sc.inverse_transform(y_norm)[0]

    return PredictionResponse(
        productivity_score=round(float(np.clip(y_orig[0], 0, 100)), 2),
        exam_score=        round(float(np.clip(y_orig[1], 0, 100)), 2)
    )


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_single(student: StudentFeatures):
    try:
        return _predict_one(student)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/predict/batch", response_model=BatchResponse, tags=["Prediction"])
def predict_batch(request: BatchRequest):
    if len(request.students) > 100:
        raise HTTPException(status_code=400, detail="Maximum 100 students per request.")
    try:
        preds = [_predict_one(s) for s in request.students]
        return BatchResponse(predictions=preds, count=len(preds))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))