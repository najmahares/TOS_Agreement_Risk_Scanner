from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.database import Base, engine
from backend.models import User, Scan, Clause, RevokedToken
from backend.ml.model import model
from backend.routers.auth import router as auth_router
from backend.routers.scans import router as scans_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Agreement Risk Scanner API",
    description="Backend API for analyzing contractual clauses.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,  
    allow_methods=["*"], 
    allow_headers=["*"],  
)


app.include_router(auth_router)
app.include_router(scans_router)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }