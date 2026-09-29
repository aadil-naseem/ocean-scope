from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.api.instruments import router as instruments_router

from app.dependencies import get_db
app = FastAPI(
    title="OceanScope API",
    description="Backend API for the OceanScope ocean visualization platform",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "project": "OceanScope",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()

    return {
        "database": "connected",
        "result": result,
    }

app.include_router(instruments_router)