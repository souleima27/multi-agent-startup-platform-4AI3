from __future__ import annotations

import json
import sys
from app.models.schemas import DocumentItem, StartupLabelSimulationInput, StartupProfile, TrackBRequest
from app.services.orchestrator import TrackBOrchestrator


"""
Simple stdio JSON RPC style server for local MCP-like integration.
Each input line must be a JSON object with a `tool` and `arguments` field.

Examples:
{"tool": "health", "arguments": {}}
{"tool": "run_track_b", "arguments": {...}}
"""


def main() -> None:
    orchestrator = TrackBOrchestrator()

    def strategic_assessment(args: dict) -> dict:
        startup_profile = StartupProfile(**args["startup_profile"])
        label_input_payload = args.get("label_input")
        label_input = StartupLabelSimulationInput(**label_input_payload) if label_input_payload else None
        payload = {"startup_profile": startup_profile, "label_input": label_input}
        return orchestrator.a1.run(payload, kb=orchestrator.kb).model_dump()

    def document_intelligence(args: dict) -> dict:
        documents = [DocumentItem(**d) for d in args.get("documents", [])]
        strict_mode = bool(args.get("strict_mode", False))
        return orchestrator.a2.run(documents, kb=orchestrator.kb, strict_mode=strict_mode).model_dump()

    tools = {
        "health": lambda _args: {"status": "ok", "server": "track-b-mcp"},
        "run_track_b": lambda args: orchestrator.run(TrackBRequest.model_validate(args)).model_dump(),
        "strategic_assessment": strategic_assessment,
        "document_intelligence": document_intelligence,
        # Backward-compatible aliases.
        "classify_legal_structure": strategic_assessment,
        "verify_documents": document_intelligence,
        "manage_documents": document_intelligence,
    }

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
            tool = request.get("tool")
            args = request.get("arguments", {})
            if tool not in tools:
                raise ValueError(f"Unknown tool: {tool}")
            result = tools[tool](args)
            print(json.dumps({"ok": True, "result": result}, ensure_ascii=False), flush=True)
        except Exception as exc:
            print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
