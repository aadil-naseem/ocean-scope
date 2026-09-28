from fastapi import FastAPI

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