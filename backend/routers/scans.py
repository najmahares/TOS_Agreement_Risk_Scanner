from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.dependencies import get_current_user
from backend.models.user import User
from backend.schemas.scan import (
    ClauseFinding,
    ScanHistoryItem,
    ScanHistoryResponse,
    ScanRequest,
    ScanResponse,
    ScanStats,
)
from backend.services.scan_service import ScanService


router = APIRouter(
    prefix="/api/v1/scans",
    tags=["Scans"],
)


def serialize_scan(scan) -> ScanResponse:
    return ScanResponse(
        scan_id=scan.id,
        title=scan.title,
        status=scan.status,
        created_at=scan.created_at,
        stats=ScanStats(
            total_clauses=scan.total_clauses,
            flagged_count=scan.flagged_count,
            flagged_percentage=scan.flagged_percentage,
            high_priority=scan.high_priority,
            medium_priority=scan.medium_priority,
        ),
        findings=[
            ClauseFinding(
                id=clause.id,
                clause_number=clause.clause_number,
                text=clause.text,
                category=clause.category,
                priority=clause.priority,
                is_flagged=clause.is_flagged,
                reason=clause.reason,
            )
            for clause in scan.clauses
        ],
    )


@router.post(
    "",
    response_model=ScanResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_scan(
    request: ScanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ScanService(db)

    scan = service.create_scan(
        user_id=current_user.id,
        title=request.title,
        text=request.text,
    )

    return serialize_scan(scan)


@router.get(
    "",
    response_model=ScanHistoryResponse,
)
def list_scans(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ScanService(db)

    scans = service.list_scans(
        user_id=current_user.id,
        offset=offset,
        limit=limit,
    )

    items = [
        ScanHistoryItem(
            scan_id=scan.id,
            title=scan.title,
            status=scan.status,
            created_at=scan.created_at,
            stats=ScanStats(
                total_clauses=scan.total_clauses,
                flagged_count=scan.flagged_count,
                flagged_percentage=scan.flagged_percentage,
                high_priority=scan.high_priority,
                medium_priority=scan.medium_priority,
            ),
        )
        for scan in scans
    ]

    total = service.count_scans(current_user.id)

    return {
    "items": items,
    "total": total,
}


@router.get(
    "/{scan_id}",
    response_model=ScanResponse,
)
def get_scan(
    scan_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ScanService(db)

    scan = service.get_scan(
        scan_id=scan_id,
        user_id=current_user.id,
    )

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found.",
        )

    return serialize_scan(scan)


@router.delete(
    "/{scan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_scan(
    scan_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ScanService(db)

    deleted = service.delete_scan(
        scan_id=scan_id,
        user_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found.",
        )
