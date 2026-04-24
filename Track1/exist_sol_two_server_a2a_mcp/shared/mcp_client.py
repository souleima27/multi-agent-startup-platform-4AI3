from __future__ import annotations

from mcp.client.session import ClientSession
from mcp.client.streamable_http import streamablehttp_client

from shared.config import MCP_BASE_URL
from shared.runtime import run_coro_sync


async def _call_tool_async(tool_name: str, arguments: dict) -> object:
    async with streamablehttp_client(MCP_BASE_URL) as (read_stream, write_stream, _):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            result = await session.call_tool(tool_name, arguments)
            if result.structuredContent is not None:
                structured = result.structuredContent
                if isinstance(structured, dict) and set(structured.keys()) == {'result'}:
                    return structured['result']
                return structured
            if result.content:
                text = getattr(result.content[0], 'text', None)
                if text is not None:
                    return text
            return None


def call_tool(tool_name: str, arguments: dict) -> object:
    return run_coro_sync(_call_tool_async(tool_name, arguments))
