import json
import os
from datetime import datetime, timezone
from typing import Any, Dict


class AuditLog:
    """Append-only audit log for router lifecycle events."""

    def __init__(self, path: str = "a2a/runtime/audit_log.jsonl"):
        self.path = path
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def append(self, event_type: str, payload: Dict[str, Any]) -> None:
        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type,
            "payload": payload,
        }
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
