from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict

from a2a.types.schemas import AdapterResponse


class BaseAdapter(ABC):
    """Network-only adapter interface."""

    @abstractmethod
    def execute(self, operation: str, payload: Dict[str, Any], credentials: Dict[str, str]) -> AdapterResponse:
        raise NotImplementedError
