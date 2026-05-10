from __future__ import annotations

from functools import lru_cache
import json
import os
import re
from typing import Any

import requests

from app.core.config import get_settings


class LocalLLMClient:
    def __init__(self, base_url: str, model: str, timeout_seconds: int = 60) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout_seconds = timeout_seconds
        self.api_key = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY") or ""

    @property
    def is_openai_compatible(self) -> bool:
        provider_url = self.base_url.lower()
        return bool(self.api_key) or "tokenfactory" in provider_url or "openai" in provider_url or "/v1" in provider_url

    def complete(self, prompt: str, system: str = "") -> str:
        if self.is_openai_compatible:
            return self._complete_openai_compatible(prompt=prompt, system=system)

        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system,
            "stream": False,
        }
        response = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
            timeout=self.timeout_seconds,
        )
        response.raise_for_status()
        body = response.json()
        return str(body.get("response", "")).strip()

    def _complete_openai_compatible(self, prompt: str, system: str = "") -> str:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system or "You are a precise startup legal assistant."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
            "max_tokens": int(os.getenv("LLM_MAX_TOKENS", "1200")),
        }
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=self.timeout_seconds,
        )
        response.raise_for_status()
        body = response.json()
        choices = body.get("choices") or []
        if not choices:
            return ""
        message = choices[0].get("message") or {}
        return str(message.get("content", "")).strip()

    def complete_json(self, prompt: str, system: str, fallback: dict[str, Any]) -> dict[str, Any]:
        try:
            text = self.complete(prompt=prompt, system=system)
            parsed = _extract_json_object(text)
            return parsed if isinstance(parsed, dict) else fallback
        except Exception:
            return fallback


def _extract_json_object(text: str) -> dict[str, Any]:
    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in LLM response")
    return json.loads(match.group(0))


@lru_cache(maxsize=1)
def get_local_llm_client() -> LocalLLMClient:
    settings = get_settings()
    return LocalLLMClient(
        base_url=settings.llm_base_url,
        model=settings.llm_model,
        timeout_seconds=settings.llm_timeout_seconds,
    )
