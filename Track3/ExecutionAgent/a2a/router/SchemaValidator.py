from dataclasses import asdict
from typing import Any, Dict

from a2a.types.schemas import ExternalActionEnvelope


class SchemaValidationError(ValueError):
    """Raised when an external action envelope fails schema validation."""


class SchemaValidator:
    """Validates and normalizes external action envelopes."""

    @staticmethod
    def validate(raw: Any) -> ExternalActionEnvelope:
        try:
            return ExternalActionEnvelope.from_input(raw)
        except Exception as exc:  # pragma: no cover - defensive boundary
            raise SchemaValidationError(str(exc)) from exc

    @staticmethod
    def dump(envelope: ExternalActionEnvelope) -> Dict[str, Any]:
        return asdict(envelope)
