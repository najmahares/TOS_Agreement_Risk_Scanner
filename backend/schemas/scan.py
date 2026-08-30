from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    title: str = Field(
        default="Agreement Analysis",
        min_length=1,
        max_length=200,
    )
    text: str = Field(
        ...,
        min_length=1, max_length=500_000, description="Agreement text to analyze",
    )


class ClauseFinding(BaseModel):
    id: UUID
    clause_number: int
    text: str
    category: str
    priority: str | None
    is_flagged: bool
    reason: str | None


class ScanStats(BaseModel):
    total_clauses: int
    flagged_count: int
    flagged_percentage: float
    high_priority: int
    medium_priority: int


class ScanResponse(BaseModel):
    scan_id: UUID
    title: str
    status: str
    created_at: datetime
    stats: ScanStats
    findings: list[ClauseFinding]


class ScanHistoryItem(BaseModel):
    scan_id: UUID
    title: str
    status: str
    created_at: datetime
    stats: ScanStats


class ScanHistoryResponse(BaseModel):
    items: list[ScanHistoryItem]
    total: int
