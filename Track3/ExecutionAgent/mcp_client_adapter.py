import os
import json
from typing import Any, Dict, List, Optional

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


class MCPProjectOpsClient:
    def __init__(self, server_script: str = "mcp_startup_server.py", python_cmd: str = "python"):
        self.server_script = server_script
        self.python_cmd = python_cmd

    def _normalize_result(self, result: Any) -> Dict[str, Any]:
        if hasattr(result, "content") and result.content:
            text_parts = []
            for item in result.content:
                text = getattr(item, "text", None)
                if text is not None:
                    text_parts.append(text)

            if len(text_parts) == 1:
                payload = text_parts[0]
                try:
                    return json.loads(payload)
                except Exception:
                    return {"raw": payload}

            return {"raw_parts": text_parts}

        try:
            return json.loads(str(result))
        except Exception:
            return {"raw": str(result)}

    async def _call_tool_async(self, tool_name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        server_params = StdioServerParameters(
            command=self.python_cmd,
            args=[self.server_script],
            env=dict(os.environ),
        )

        async with stdio_client(server_params) as (read_stream, write_stream):
            async with ClientSession(read_stream, write_stream) as session:
                await session.initialize()
                result = await session.call_tool(tool_name, arguments or {})
                return self._normalize_result(result)

    def call_tool(self, tool_name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        import asyncio
        return asyncio.run(self._call_tool_async(tool_name, arguments or {}))

    async def call_tool_async(self, tool_name: str, arguments: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return await self._call_tool_async(tool_name, arguments or {})

    async def list_tasks_async(self, status: Optional[str] = None, assigned_to: Optional[str] = None) -> Dict[str, Any]:
        args = {}
        if status is not None:
            args["status"] = status
        if assigned_to is not None:
            args["assigned_to"] = assigned_to
        return await self.call_tool_async("list_tasks", args)

    async def upsert_tasks_async(self, tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
        return await self.call_tool_async("upsert_tasks", {"tasks": tasks})

    async def update_task_status_async(
        self,
        task_id: str,
        new_status: str,
        blocked_reason: Optional[str] = None,
        progress: Optional[float] = None,
        actual_days: Optional[float] = None,
    ) -> Dict[str, Any]:
        return await self.call_tool_async("update_task_status", {
            "task_id": task_id,
            "new_status": new_status,
            "blocked_reason": blocked_reason,
            "progress": progress,
            "actual_days": actual_days,
        })

    async def get_team_capacity_async(self) -> Dict[str, Any]:
        return await self.call_tool_async("get_team_capacity", {})

    async def clear_runtime_tasks_async(self) -> Dict[str, Any]:
        return await self.call_tool_async("clear_runtime_tasks", {})

    async def sync_tasks_to_jira_async(self, tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
        return await self.call_tool_async("sync_tasks_to_jira", {"tasks": tasks})

    async def fetch_jira_updates_async(self) -> Dict[str, Any]:
        return await self.call_tool_async("fetch_jira_updates", {})