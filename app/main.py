from fastapi import FastAPI

from app.core.database import Base, engine
from app.models import User, Scan, Clause, RevokedToken
from app.ml.model import model
from app.routers.auth import router as auth_router
from app.routers.scans import router as scans_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Agreement Risk Scanner API",
    description="Backend API for analyzing contractual clauses.",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(scans_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }