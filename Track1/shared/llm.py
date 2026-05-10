import os

import httpx
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

from shared.config import MODEL_NAME, OLLAMA_API_BASE


def get_chat_model(temperature: float = 0.2):
    mode = os.getenv("MODEL_MODE", "local").lower()
    api_key = os.getenv("LLM_API_KEY", "")
    base_url = os.getenv("LLM_BASE_URL", "").rstrip("/")
    model = os.getenv("LLM_MODEL") or os.getenv("LLM_PLANNER_MODEL") or MODEL_NAME

    if mode in {"remote", "hybrid", "openai"} or (api_key and base_url):
        verify_ssl = os.getenv("LLM_VERIFY_SSL", "true").lower() in {"true", "1", "yes"}
        return ChatOpenAI(
            api_key=api_key,
            base_url=base_url,
            model=model,
            temperature=temperature,
            http_client=httpx.Client(verify=verify_ssl, timeout=120.0),
        )

    return ChatOllama(
        model=MODEL_NAME,
        base_url=OLLAMA_API_BASE,
        temperature=temperature,
    )
