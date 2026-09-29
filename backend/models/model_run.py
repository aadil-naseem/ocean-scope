from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ModelRun(Base):
    __tablename__ = "model_runs"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    dataset_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    source_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    run_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    variables: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    min_lat: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    max_lat: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    min_lon: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    max_lon: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )