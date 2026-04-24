import os
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

MODEL_NAME = os.getenv("MODEL_NAME", "qwen3:8b")
OLLAMA_API_BASE = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
A2A_BASE_URL = os.getenv("A2A_BASE_URL", "http://127.0.0.1:8001/a2a")
MCP_BASE_URL = os.getenv("MCP_BASE_URL", "http://127.0.0.1:8000/mcp")
KB_PATH = PROJECT_ROOT / "finance_knowledge" / "cost_agent_kb.json"
