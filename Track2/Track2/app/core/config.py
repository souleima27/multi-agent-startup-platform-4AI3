from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Track B Legal & Administrative PRO"
    app_env: str = "dev"
    debug: bool = True
    host: str = "127.0.0.1"
    port: int = 8000
    project_root: Path = Path(__file__).resolve().parents[2]
    dataset_dir: Path = project_root / "data" / "dataset"
    reports_dir: Path = project_root / "reports"
    llm_base_url: str = "http://127.0.0.1:11434"
    llm_model: str = "deepseek-r1:7b"
    llm_timeout_seconds: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
