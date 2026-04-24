import os
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

MODEL_NAME = os.getenv("MODEL_NAME", "qwen3:8b")
OLLAMA_API_BASE = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")

A2A_BASE_URL = os.getenv("A2A_BASE_URL", "http://127.0.0.1:8001/a2a")
MCP_BASE_URL = os.getenv("MCP_BASE_URL", "http://127.0.0.1:8000/mcp")

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "startup_companies"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "youssef2003"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "5432")),
}

OLLAMA_EMBED_URL = os.getenv("OLLAMA_EMBED_URL", "http://localhost:11434/api/embed")
EMBED_MODEL = os.getenv("EMBED_MODEL", "nomic-embed-text-v2-moe")

KB_PATH = PROJECT_ROOT / "finance_knowledge" / "cost_agent_kb.json"