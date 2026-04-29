from typing import Any, Dict


class BaseA2AAgent:
    def __init__(self, name: str):
        self.name = name

    async def handle_message(self, message) -> Dict[str, Any]:
        raise NotImplementedError


class PlannerA2AAgent(BaseA2AAgent):
    def __init__(self, name: str, planner_fn):
        super().__init__(name)
        self.planner_fn = planner_fn

    async def handle_message(self, message) -> Dict[str, Any]:
        if message.performative != "plan":
            return {"ok": False, "error": f"Unsupported performative: {message.performative}"}
        state = message.payload["state"]
        llm = message.payload["llm"]
        new_state = self.planner_fn(state, llm)
        return {
            "ok": True,
            "planner_used": new_state.get("execution_state", {}).get("planner_used"),
            "draft_plan": new_state.get("execution_state", {}).get("draft_plan", {}),
            "state": new_state,
        }


class CriticA2AAgent(BaseA2AAgent):
    def __init__(self, name: str, critic_fn):
        super().__init__(name)
        self.critic_fn = critic_fn

    async def handle_message(self, message) -> Dict[str, Any]:
        if message.performative != "critic_review":
            return {"ok": False, "error": f"Unsupported performative: {message.performative}"}
        state = message.payload["state"]
        llm = message.payload["llm"]
        new_state = self.critic_fn(state, llm)
        return {
            "ok": True,
            "critic_used": new_state.get("execution_state", {}).get("critic_used"),
            "critic_report": new_state.get("execution_state", {}).get("critic_report", {}),
            "state": new_state,
        }


class ActionA2AAgent(BaseA2AAgent):
    def __init__(self, name: str, action_fn):
        super().__init__(name)
        self.action_fn = action_fn

    async def handle_message(self, message) -> Dict[str, Any]:
        if message.performative != "decide_actions":
            return {"ok": False, "error": f"Unsupported performative: {message.performative}"}
        state = message.payload["state"]
        new_state = self.action_fn(state)
        return {
            "ok": True,
            "action_plan": new_state.get("execution_state", {}).get("action_plan", []),
            "state": new_state,
        }


class ReportA2AAgent(BaseA2AAgent):
    def __init__(self, name: str, executive_summary_fn, owner_action_plan_fn, decisions_fn):
        super().__init__(name)
        self.executive_summary_fn = executive_summary_fn
        self.owner_action_plan_fn = owner_action_plan_fn
        self.decisions_fn = decisions_fn

    async def handle_message(self, message) -> Dict[str, Any]:
        if message.performative != "build_report_context":
            return {"ok": False, "error": f"Unsupported performative: {message.performative}"}
        result = message.payload["result"]
        task_list = result.get("task_list", [])
        return {
            "ok": True,
            "executive_summary": self.executive_summary_fn(result),
            "owner_action_plan": self.owner_action_plan_fn(task_list),
            "decisions": self.decisions_fn(result),
        }
