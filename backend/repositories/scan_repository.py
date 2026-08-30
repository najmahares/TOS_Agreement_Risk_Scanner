
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from backend.models.clause import Clause
from backend.models.scan import Scan


class ScanRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_scan(
        self,
        user_id: UUID,
        title: str,
        input_text: str,
        analysis: dict,
    ) -> Scan:
        scan = Scan(
            user_id=user_id,
            title=title,
            input_text=input_text,
            status="completed",
            total_clauses=analysis["total_clauses"],
            flagged_count=analysis["flagged_count"],
            flagged_percentage=analysis["flagged_percentage"],
            high_priority=analysis["high_priority"],
            medium_priority=analysis["medium_priority"],
        )

        for finding in analysis["findings"]:
            scan.clauses.append(
                Clause(
                    clause_number=finding["clause_number"],
                    text=finding["text"],
                    category=finding["category"],
                    priority=finding["priority"],
                    is_flagged=finding["is_flagged"],
                    reason=finding["reason"],
                )
            )

        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)

        return scan

    def get_by_id(
        self,
        scan_id: UUID,
        user_id: UUID,
    ) -> Scan | None:
        statement = (
            select(Scan)
            .where(
                Scan.id == scan_id,
                Scan.user_id == user_id,
            )
            .options(selectinload(Scan.clauses))
        )

        return self.db.scalar(statement)

    def list_by_user(
        self,
        user_id: UUID,
        offset: int = 0,
        limit: int = 20,
    ) -> list[Scan]:
        statement = (
            select(Scan)
            .where(Scan.user_id == user_id)
            .order_by(Scan.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())

    def count_by_user(self, user_id: UUID) -> int:
        statement = (
            select(func.count())
            .select_from(Scan)
            .where(Scan.user_id == user_id)
        )

        return self.db.scalar(statement) or 0

    def delete(
        self,
        scan_id: UUID,
        user_id: UUID,
    ) -> bool:
        scan = self.get_by_id(scan_id, user_id)

        if not scan:
            return False

        self.db.delete(scan)
        self.db.commit()

        return True
