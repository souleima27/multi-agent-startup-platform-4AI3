from __future__ import annotations

import uuid

import httpx
from a2a.client import ClientConfig, ClientFactory
from a2a.client.card_resolver import A2ACardResolver
from a2a.types import Message, Part, Role, TextPart

from shared.config import A2A_BASE_URL
from shared.runtime import run_coro_sync


def _extract_message_text(message: Message | None) -> str:
    if message is None:
        return ""

    parts: list[str] = []
    for part in message.parts:
        root = getattr(part, "root", None)
        text = getattr(root, "text", None)
        if text:
            parts.append(text)

    return "\n".join(parts).strip()


async def _send_text_async(agent_name: str, text: str) -> str:
    base_url = f"{A2A_BASE_URL.rstrip('/')}/{agent_name}/"

    timeout = httpx.Timeout(600.0)

    async with httpx.AsyncClient(timeout=timeout) as http_client:
        resolver = A2ACardResolver(http_client, base_url)
        card = await resolver.get_agent_card()

        client = ClientFactory(
            ClientConfig(
                streaming=False,
                httpx_client=http_client,
            )
        ).create(card)

        message = Message(
            messageId=str(uuid.uuid4()),
            role=Role.user,
            parts=[Part(root=TextPart(text=text))],
        )

        last_text = ""

        async for item in client.send_message(message):
            if isinstance(item, Message):
                last_text = _extract_message_text(item) or last_text
            else:
                task, _update = item
                status_message = getattr(task.status, "message", None)
                text_from_status = _extract_message_text(status_message)
                if text_from_status:
                    last_text = text_from_status

        return last_text.strip()


def send_text(agent_name: str, text: str) -> str:
    return run_coro_sync(_send_text_async(agent_name, text))