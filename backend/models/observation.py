from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Observation(Base):
    __tablename__ = "observations"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    instrument_id: Mapped[str] = mapped_column(
        ForeignKey("instruments.id"),
        nullable=False,
        index=True,
    )

    observed_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    depth_m: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    temperature_c: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    salinity_psu: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    current_u: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    current_v: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    quality_flag: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )