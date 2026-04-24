# finance_two_server_a2a_mcp

Two backend servers only:
- `a2a_server.py` hosts the agents: `cost_agent`, `revenue_agent`, `research_agent`, `webpage_reader_agent`
- `mcp_server.py` hosts the tools: cost KB, web search/read, and math tools

The prompts from your original scripts are preserved verbatim in:
- `manager_ag.py`
- `cost_ag.py`
- `revenue_ag.py`
- `research_ag.py`
- `webpage_reader_ag.py` (copied from the prompt inside your original `tools.py`)

## Install

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

Terminal 1:

```bash
python a2a_server.py
```

Terminal 2:

```bash
python mcp_server.py
```

Terminal 3:

```bash
python manager_ag.py
```

Or use the example input files in `examples/`.
