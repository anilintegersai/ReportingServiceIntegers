from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).parent
MANIFESTS_DIR = BASE_DIR / "manifests"
USERS_FILE = BASE_DIR / "users" / "users.json"
TENANTS_FILE = BASE_DIR / "tenants" / "tenants.json"


class Settings(BaseSettings):
    powerbi_tenant_id: str = ""
    powerbi_client_id: str = ""
    powerbi_client_secret: str = ""
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expiry_hours: int = 8

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
