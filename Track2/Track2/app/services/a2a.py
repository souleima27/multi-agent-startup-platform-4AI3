from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class A2AMessage:
    sender: str
    receiver: str
    action: str
    payload: Any
    kwargs: dict[str, Any] = field(default_factory=dict)


class A2ABus:
    def __init__(self) -> None:
        self._handlers: dict[str, Callable[..., Any]] = {}

    def register(self, agent_name: str, handler: Callable[..., Any]) -> None:
        self._handlers[agent_name] = handler

    def send(self, message: A2AMessage) -> Any:
        if message.receiver not in self._handlers:
            raise ValueError(f"Receiver not registered on A2A bus: {message.receiver}")
        return self._handlers[message.receiver](message.payload, **message.kwargs)
