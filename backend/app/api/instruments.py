from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from models.instrument import Instrument
from app.schemas.instrument import InstrumentCreate, InstrumentResponse


router = APIRouter(
    prefix="/api/instruments",
    tags=["Instruments"],
)


@router.get("/", response_model=list[InstrumentResponse])
def get_instruments(db: Session = Depends(get_db)):
    return db.query(Instrument).all()


@router.post("/", response_model=InstrumentResponse)
def create_instrument(
    instrument: InstrumentCreate,
    db: Session = Depends(get_db),
):
    db_instrument = Instrument(
        instrument_code=instrument.instrument_code,
        instrument_type=instrument.instrument_type,
        name=instrument.name,
        platform_metadata=instrument.platform_metadata,
    )

    db.add(db_instrument)
    db.commit()
    db.refresh(db_instrument)

    return db_instrument