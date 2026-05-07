import json
import os
from dataclasses import asdict
from datetime import datetime, timezone
from typing import Dict

from a2a.types.schemas import ExternalActionEnvelope, ExternalActionResult


class DeadLetterQueue:
    def __init__(self, path: str = "a2a/runtime/dead_letter_queue.jsonl"):
        self.path = path
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def push(self, envelope: ExternalActionEnvelope, result: ExternalActionResult) -> None:
        record: Dict[str, object] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "envelope": envelope.to_dict(redact_credentials=True),
            "result": asdict(result),
        }
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
