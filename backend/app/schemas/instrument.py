from pydantic import BaseModel


class InstrumentCreate(BaseModel):
    instrument_code: str
    instrument_type: str
    name: str
    platform_metadata: dict | None = None


class InstrumentResponse(BaseModel):
    id: str
    instrument_code: str
    instrument_type: str
    name: str
    platform_metadata: dict | None = None

    class Config:
        from_attributes = True
