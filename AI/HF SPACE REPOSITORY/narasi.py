import os

from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google import genai

from interpreter import interpret_data_siswa
from prompt_engine import buat_prompt_guru, buat_prompt_admin, buat_prompt_ortu

_api_key = os.environ.get("GEMINI_API_KEY", "")
if not _api_key:
    raise RuntimeError("GEMINI_API_KEY tidak ditemukan!")
client = genai.Client(api_key=_api_key)

router = APIRouter()


class DataSiswa(BaseModel):
    nama: Optional[str] = "Siswa"
    age: float
    study_hours: float
    self_study_hours: float
    online_classes_hours: float
    social_media_hours: float
    gaming_hours: float
    sleep_hours: float
    screen_time_hours: float
    mental_health_score: float
    focus_index: float
    burnout_level: float
    productivity_score: float
    exam_score: float


class DataKelas(BaseModel):
    nama_kelas: str
    total_siswa: int
    siswa_aman: int
    siswa_berisiko: int
    avg_study_hours: float
    avg_distraksi: float
    avg_burnout: float
    avg_exam_score: float
    faktor_dominan: str


def generate(prompt: str) -> str:
    try:
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return resp.text.strip()
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Gemini error: {str(e)}")


@router.get("/health", tags=["Health"])
def health():
    try:
        r = client.models.generate_content(
            model="gemini-2.5-flash", contents="Output harus persis: OK"
        )
        return {"status": "ok", "gemini": "terhubung", "ping": r.text.strip()}
    except Exception as e:
        return {"status": "error", "gemini": "tidak terhubung", "detail": str(e)}


@router.post("/narasi/guru", tags=["Narasi"])
def narasi_guru(data: DataSiswa):
    return {
        "status": "success",
        "persona": "guru",
        "narasi": generate(buat_prompt_guru(data.dict()))
    }


@router.post("/narasi/admin", tags=["Narasi"])
def narasi_admin(data: DataKelas):
    return {
        "status": "success",
        "persona": "admin",
        "narasi": generate(buat_prompt_admin(data.dict()))
    }


@router.post("/narasi/ortu", tags=["Narasi"])
def narasi_ortu(data: DataSiswa):
    return {
        "status": "success",
        "persona": "ortu",
        "narasi": generate(buat_prompt_ortu(data.dict()))
    }