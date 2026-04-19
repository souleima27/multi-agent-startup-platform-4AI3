import json
from typing import Any, Dict, List, Optional

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


class MCPProjectOpsClient:
    """
    MCP client wrapper.
    Use sync methods in scripts or async methods in notebooks / async flows.
    """

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
            env=None,
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

    async def create_task_async(self, task: Dict[str, Any]) -> Dict[str, Any]:
        return await self.call_tool_async("create_task", {"task": task})

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

    async def assign_owner_async(self, task_id: str, owner: str) -> Dict[str, Any]:
        return await self.call_tool_async("assign_owner", {"task_id": task_id, "owner": owner})

    async def generate_execution_summary_async(self, summary: Dict[str, Any]) -> Dict[str, Any]:
        return await self.call_tool_async("generate_execution_summary", {"summary": summary})

    async def execute_action_async(self, action: Dict[str, Any]) -> Dict[str, Any]:
        action_type = action.get("type")

        if action_type == "create_task":
            return await self.create_task_async(action.get("task", {}))
        if action_type == "update_status":
            return await self.update_task_status_async(
                task_id=action.get("task_id", ""),
                new_status=action.get("new_status", "todo"),
                blocked_reason=action.get("blocked_reason"),
                progress=action.get("progress"),
                actual_days=action.get("actual_days"),
            )
        if action_type == "assign_owner":
            return await self.assign_owner_async(
                task_id=action.get("task_id", ""),
                owner=action.get("owner", ""),
            )
        if action_type == "generate_summary":
            return await self.generate_execution_summary_async(action.get("summary", {}))

        return {"ok": False, "error": f"Unsupported action type: {action_type}", "action": action}
