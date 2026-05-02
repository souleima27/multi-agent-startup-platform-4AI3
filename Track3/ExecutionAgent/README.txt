Folder content:
- execution_agent_with_mcp.py  -> main orchestrator with A2A integrated
- a2a_protocol.py              -> simple in-process A2A bus
- a2a_agents.py                -> Planner / Critic / Action / Report agents

What stays unchanged:
- MCP is still the bridge to Jira
- mcp_client_adapter.py is still used
- mcp_startup_server.py still owns Jira API logic
- launch.json can still inject Jira env vars

How to use:
1) Copy these files into your existing project folder.
2) Keep your current:
   - mcp_client_adapter.py
   - mcp_startup_server.py
   - startup_state.json
   - launch.json
   - structured_kb_sections/
3) Run:
   python execution_agent_with_mcp.py

Important:
- A2A here is local and lightweight.
- It is only for agent-to-agent reasoning.
- It does not replace MCP.
