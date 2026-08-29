from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    input_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="completed",
    )

    total_clauses: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    flagged_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    flagged_percentage: Mapped[float] = mapped_column(
        nullable=False,
        default=0,
    )

    high_priority: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    medium_priority: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    clauses: Mapped[list["Clause"]] = relationship(
        back_populates="scan",
        cascade="all, delete-orphan",
    )
