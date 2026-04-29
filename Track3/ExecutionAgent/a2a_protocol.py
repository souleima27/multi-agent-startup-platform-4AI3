import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, Optional


def utc_now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


@dataclass
class A2AMessage:
    message_id: str
    sender: str
    recipient: str
    performative: str
    payload: Dict[str, Any]
    conversation_id: str
    parent_message_id: Optional[str] = None
    created_at: str = field(default_factory=utc_now_iso)


class A2ABus:
    """
    Very small in-process Agent-to-Agent bus.
    It does not replace MCP or Jira.
    It only lets specialized agents collaborate locally.
    """

    def __init__(self):
        self._agents: Dict[str, Any] = {}

    def register(self, agent_name: str, agent_obj: Any) -> None:
        self._agents[agent_name] = agent_obj

    async def send(
        self,
        sender: str,
        recipient: str,
        performative: str,
        payload: Dict[str, Any],
        conversation_id: Optional[str] = None,
        parent_message_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        if recipient not in self._agents:
            raise ValueError(f"A2A recipient not found: {recipient}")

        msg = A2AMessage(
            message_id=str(uuid.uuid4()),
            sender=sender,
            recipient=recipient,
            performative=performative,
            payload=payload,
            conversation_id=conversation_id or str(uuid.uuid4()),
            parent_message_id=parent_message_id,
        )

        response = await self._agents[recipient].handle_message(msg)
        if not isinstance(response, dict):
            return {"ok": False, "error": "A2A handler returned a non-dict response."}
        return response
