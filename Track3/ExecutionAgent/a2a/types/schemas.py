from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Mapping, Optional


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class Destination:
    system: str
    operation: str

    @classmethod
    def from_input(cls, raw: Mapping[str, Any]) -> "Destination":
        system = str(raw.get("system", "")).strip().lower()
        operation = str(raw.get("operation", "")).strip()
        if not system:
            raise ValueError("destination.system is required")
        if not operation:
            raise ValueError("destination.operation is required")
        return cls(system=system, operation=operation)


@dataclass
class ExecutionPolicy:
    max_attempts: int = 5
    base_delay_seconds: float = 1.0
    jitter_seconds: float = 0.25
    rate_limit_key: Optional[str] = None

    @classmethod
    def from_input(cls, raw: Optional[Mapping[str, Any]]) -> "ExecutionPolicy":
        raw = raw or {}
        return cls(
            max_attempts=int(raw.get("max_attempts", 5)),
            base_delay_seconds=float(raw.get("base_delay_seconds", 1.0)),
            jitter_seconds=float(raw.get("jitter_seconds", 0.25)),
            rate_limit_key=raw.get("rate_limit_key"),
        )


@dataclass
class AuditInfo:
    trace_id: Optional[str] = None
    requested_by: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    @classmethod
    def from_input(cls, raw: Optional[Mapping[str, Any]]) -> "AuditInfo":
        raw = raw or {}
        return cls(
            trace_id=raw.get("trace_id"),
            requested_by=raw.get("requested_by"),
            tags=[str(tag) for tag in raw.get("tags", [])],
        )


@dataclass
class ExternalActionEnvelope:
    action_id: str
    type: str
    seq: int
    depends_on: List[str]
    destination: Destination
    payload: Dict[str, Any]
    execution_policy: ExecutionPolicy = field(default_factory=ExecutionPolicy)
    audit: AuditInfo = field(default_factory=AuditInfo)
    idempotency_key: str = ""

    @classmethod
    def from_input(cls, raw: Any) -> "ExternalActionEnvelope":
        if isinstance(raw, cls):
            return raw
        if not isinstance(raw, Mapping):
            raise ValueError("ExternalActionEnvelope must be a mapping")

        action_id = str(raw.get("action_id", "")).strip()
        envelope_type = str(raw.get("type", "")).strip().lower()
        seq = int(raw.get("seq", 0))
        depends_on = [str(item) for item in raw.get("depends_on", [])]
        destination = Destination.from_input(raw.get("destination", {}))
        payload = raw.get("payload")

        if not action_id:
            raise ValueError("action_id is required")
        if envelope_type != "external":
            raise ValueError("type must be 'external'")
        if not isinstance(payload, dict):
            raise ValueError("payload must be a dict")

        envelope = cls(
            action_id=action_id,
            type=envelope_type,
            seq=seq,
            depends_on=depends_on,
            destination=destination,
            payload=payload,
            execution_policy=ExecutionPolicy.from_input(raw.get("execution_policy")),
            audit=AuditInfo.from_input(raw.get("audit")),
        )
        envelope.idempotency_key = envelope.generate_idempotency_key()
        return envelope

    def generate_idempotency_key(self) -> str:
        payload_hash = hashlib.sha256(
            json.dumps(self.payload, ensure_ascii=False, sort_keys=True).encode("utf-8")
        ).hexdigest()
        seed = f"{self.action_id}:{self.destination.system}:{payload_hash}"
        return hashlib.sha256(seed.encode("utf-8")).hexdigest()

    def payload_with_idempotency(self) -> Dict[str, Any]:
        payload = dict(self.payload)
        payload["idempotency_key"] = self.idempotency_key
        return payload

    def to_dict(self, redact_credentials: bool = False) -> Dict[str, Any]:
        data = asdict(self)
        if redact_credentials and "credentials" in data.get("payload", {}):
            data["payload"]["credentials"] = "***redacted***"
        return data


@dataclass
class AdapterResponse:
    success: bool
    external_ref_id: Optional[str] = None
    retryable: bool = False
    error: Optional[str] = None
    status_code: Optional[int] = None
    raw_response: Optional[Dict[str, Any]] = None


@dataclass
class ExternalActionResult:
    action_id: str
    system: str
    operation: str
    success: bool
    retryable: bool
    external_ref_id: Optional[str] = None
    error: Optional[str] = None
    status_code: Optional[int] = None
    attempts: int = 1
    settled: bool = True
    completed_at: str = field(default_factory=_utc_now)

    @classmethod
    def from_adapter_response(
        cls,
        envelope: ExternalActionEnvelope,
        adapter_result: AdapterResponse,
        attempts: int,
    ) -> "ExternalActionResult":
        return cls(
            action_id=envelope.action_id,
            system=envelope.destination.system,
            operation=envelope.destination.operation,
            success=adapter_result.success,
            retryable=adapter_result.retryable,
            external_ref_id=adapter_result.external_ref_id,
            error=adapter_result.error,
            status_code=adapter_result.status_code,
            attempts=attempts,
            settled=True,
        )

    @classmethod
    def from_failure(
        cls,
        envelope: ExternalActionEnvelope,
        error: str,
        retryable: bool,
        attempts: int,
        settled: bool = True,
    ) -> "ExternalActionResult":
        return cls(
            action_id=envelope.action_id,
            system=envelope.destination.system,
            operation=envelope.destination.operation,
            success=False,
            retryable=retryable,
            error=error,
            attempts=attempts,
            settled=settled,
        )
