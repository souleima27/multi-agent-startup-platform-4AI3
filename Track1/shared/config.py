import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

MODEL_NAME = os.getenv("MODEL_NAME", "qwen3:8b")
OLLAMA_API_BASE = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")

A2A_BASE_URL = os.getenv("A2A_BASE_URL", "http://127.0.0.1:8001/a2a")
MCP_BASE_URL = os.getenv("MCP_BASE_URL", "http://127.0.0.1:8000/mcp")

def _build_db_config() -> dict:
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        parsed = urlparse(database_url)
        return {
            "dbname": parsed.path.lstrip("/"),
            "user": parsed.username,
            "password": parsed.password,
            "host": parsed.hostname,
            "port": parsed.port or 5432,
            "sslmode": os.getenv("DB_SSLMODE", "require"),
        }

    return {
        "dbname": os.getenv("DB_NAME", "startup_companies"),
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", ""),
        "host": os.getenv("DB_HOST", "localhost"),
        "port": int(os.getenv("DB_PORT", "5432")),
    }


DB_CONFIG = _build_db_config()

OLLAMA_EMBED_URL = os.getenv("OLLAMA_EMBED_URL", "http://localhost:11434/api/embed")
EMBED_MODEL = os.getenv("EMBED_MODEL", "nomic-embed-text-v2-moe")
EMBED_API_KEY = os.getenv("EMBED_API_KEY", os.getenv("LLM_API_KEY", ""))
EMBED_BASE_URL = os.getenv("EMBED_BASE_URL", os.getenv("LLM_BASE_URL", "")).rstrip("/")
EMBED_VERIFY_SSL = os.getenv("EMBED_VERIFY_SSL", os.getenv("LLM_VERIFY_SSL", "true")).lower() in {"true", "1", "yes"}

KB_PATH = PROJECT_ROOT / "finance_knowledge" / "cost_agent_kb.json"
