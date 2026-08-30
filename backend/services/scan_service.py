from uuid import UUID

from backend.repositories.scan_repository import ScanRepository
from backend.services.scanner import analyze_agreement


class ScanService:
    def __init__(self, db):
        self.scans = ScanRepository(db)

    def create_scan(
        self,
        user_id: UUID,
        title: str,
        text: str,
    ):
        analysis = analyze_agreement(text)

        return self.scans.create_scan(
            user_id=user_id,
            title=title,
            input_text=text,
            analysis=analysis,
        )

    def list_scans(
        self,
        user_id: UUID,
        offset: int = 0,
        limit: int = 20,
    ):
        return self.scans.list_by_user(
            user_id=user_id,
            offset=offset,
            limit=limit,
        )

    def count_scans(self, user_id: UUID) -> int:
        return self.scans.count_by_user(user_id)

    def get_scan(
        self,
        scan_id: UUID,
        user_id: UUID,
    ):
        return self.scans.get_by_id(
            scan_id=scan_id,
            user_id=user_id,
        )

    def delete_scan(
        self,
        scan_id: UUID,
        user_id: UUID,
    ) -> bool:
        return self.scans.delete(
            scan_id=scan_id,
            user_id=user_id,
        )