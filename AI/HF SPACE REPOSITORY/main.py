from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from predict import router as predict_router
from narasi import router as narasi_router

app = FastAPI(
    title="SNBPredict API",
    description="Student performance prediction and AI narrative service.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(predict_router)
app.include_router(narasi_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "endpoints": [
            "POST /predict",
            "POST /predict/batch",
            "GET  /health",
            "POST /narasi/guru",
            "POST /narasi/admin",
            "POST /narasi/ortu"
        ]
    }
