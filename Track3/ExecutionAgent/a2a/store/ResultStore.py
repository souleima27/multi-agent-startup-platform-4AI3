import json
import os
from dataclasses import asdict

from a2a.types.schemas import ExternalActionResult


class ResultStore:
    """Append-only result store for external action results."""

    def __init__(self, path: str = "a2a/runtime/external_action_results.jsonl"):
        self.path = path
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def append(self, result: ExternalActionResult) -> None:
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(json.dumps(asdict(result), ensure_ascii=False) + "\n")
