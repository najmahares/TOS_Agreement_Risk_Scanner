
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "Agreement Risk Scanner API"
    environment: str = "development"
    database_url: str
    jwt_private_key_path: str = "secrets/jwt_private.pem"
    jwt_public_key_path: str = "secrets/jwt_public.pem"
    jwt_algorithm: str = "RS256"
    access_token_expire_minutes: int = 15
    cors_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def jwt_private_key(self) -> str:
        return (BASE_DIR / self.jwt_private_key_path).read_text()

    @property
    def jwt_public_key(self) -> str:
        return (BASE_DIR / self.jwt_public_key_path).read_text()


settings = Settings()