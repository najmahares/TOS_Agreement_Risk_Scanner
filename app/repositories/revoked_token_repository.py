
from datetime import datetime
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.revoked_token import RevokedToken


class RevokedTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def exists(self, jti: str) -> bool:
        statement = select(RevokedToken.id).where(
            RevokedToken.jti == jti
        )

        return self.db.scalar(statement) is not None

    def revoke(
        self,
        jti: str,
        expires_at: datetime,
    ) -> RevokedToken:
        token = RevokedToken(
            jti=jti,
            expires_at=expires_at,
        )

        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)

        return token

    def delete_expired(self) -> int:
        statement = delete(RevokedToken).where(
            RevokedToken.expires_at < datetime.now().astimezone()
        )

        result = self.db.execute(statement)
        self.db.commit()

        return result.rowcount
