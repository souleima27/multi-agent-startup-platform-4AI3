# Execution Agent with MCP, A2A and Jira Synchronization

## 📌 Overview

**Execution Agent with MCP, A2A and Jira Synchronization** is an AI-powered project execution system that transforms a startup MVP plan into a structured, trackable execution workflow.

The agent can:

- Analyze a startup idea and MVP scope
- Generate milestones and tasks
- Estimate task duration
- Compute task priority and criticality
- Build a dependency graph
- Assign tasks to team members based on skills and workload
- Detect risks, blockers and anomalies
- Decide the correct Jira action for each task
- Synchronize tasks with Jira through MCP
- Generate a detailed JSON execution result
- Generate a professional PDF execution report

This project is designed as an academic and practical prototype for **AI-powered project management**, **agentic workflow orchestration**, and **MCP-based tool integration**.

---

## 🚀 Key Features

### ✅ Execution Planning

The agent automatically converts startup MVP information into:

- Milestones
- Work packages
- Tasks
- Dependencies
- Deadlines
- Priorities
- Owner assignments

### ✅ A2A Local Agent Collaboration

The system includes a lightweight local A2A layer composed of specialized agents:

- **Planner Agent**: generates or improves the execution plan
- **Critic Agent**: reviews the plan and detects weaknesses
- **Action Agent**: decides what should happen to each task
- **Report Agent**: builds reporting context and executive summaries

> Note: The A2A layer is local and in-process. It is used for internal agent collaboration and does not replace MCP.

### ✅ MCP Integration

MCP is used as the bridge between the Execution Agent and project management operations.

The MCP server handles:

- Runtime task storage
- Task listing
- Task upsert
- Status updates
- Team capacity retrieval
- Jira synchronization
- Jira update fetching

### ✅ Jira Synchronization

When Jira sync is enabled, the agent can:

- Create new Jira issues
- Update existing Jira issues
- Transition Jira statuses
- Preserve Jira issue keys
- Refresh Jira status after synchronization
- Store Jira metadata inside the runtime file

### ✅ Knowledge Base Retrieval

The agent can use a local structured knowledge base to retrieve useful execution patterns and improve planning quality.

It uses:

- Sentence Transformer embeddings
- Cross Encoder reranking
- Top-k retrieval
- Category-based search

### ✅ PDF Reporting

A PDF execution report can be generated from the execution result.

The report includes:

- Project overview
- Execution health summary
- Jira synchronization summary
- Team composition and workload
- Knowledge retrieval summary
- Dependency analysis
- Priority tasks
- Blocked tasks
- Anomalies
- Critic feedback
- Recommended next actions
- Full task inventory

---

## 🧠 Project Architecture

```text
startup_state.json
        |
        v
execution_agent_with_mcp.py
        |
        |-- Knowledge Base Retrieval
        |-- Planner A2A Agent
        |-- Critic A2A Agent
        |-- Action A2A Agent
        |-- Report A2A Agent
        |
        v
mcp_client_adapter.py
        |
        v
mcp_startup_server.py
        |
        |-- Runtime JSON Storage
        |-- Jira API Integration
        |
        v
agent_runtime.json
        |
        v
execution_agent_outputs/
        |
        |-- execution_result_<StartupName>.json
        |-- <StartupName>_Execution_Report.pdf
```

---

## 📁 Project Structure

```text
.
├── execution_agent_with_mcp.py       # Main execution orchestrator
├── mcp_startup_server.py             # MCP server and Jira API logic
├── mcp_client_adapter.py             # Client adapter used to call MCP tools
├── a2a_protocol.py                   # Lightweight local A2A message bus
├── a2a_agents.py                     # Planner, Critic, Action and Report agents
├── pdf_report_generator.py           # PDF report generator
├── execution_kb_pipeline.ipynb       # Notebook for knowledge base preparation
├── startup_state.json                # Startup profile, MVP plan, deadlines and team data
├── agent_runtime.json                # Local runtime task state
├── launch.json                       # VS Code launch config
├── structured_kb_sections/           # Structured local knowledge base
└── execution_agent_outputs/          # Generated JSON and PDF outputs
```

---

## 🛠️ Technologies Used

- Python
- MCP
- Jira REST API
- OpenAI-compatible LLM client
- Sentence Transformers
- Cross Encoder reranking
- NetworkX
- Pandas
- HTTPX
- ReportLab
- JSON runtime persistence

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

---

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate the environment:

#### Windows

```bash
.venv\Scripts\activate
```

#### Linux / macOS

```bash
source .venv/bin/activate
```

---

### 3. Install dependencies

```bash
pip install pandas networkx httpx openai sentence-transformers reportlab mcp
```

Optional but recommended:

```bash
pip install python-dotenv
```

---

## 📦 Recommended `requirements.txt`

You can create a `requirements.txt` file with:

```txt
pandas
networkx
httpx
openai
sentence-transformers
reportlab
mcp
python-dotenv
```

Then install everything with:

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file in the root folder.

> Never commit `.env` to GitHub.

Example:

```env
# Execution mode
MODEL_MODE=local

# LLM configuration
LLM_API_KEY=your_llm_api_key_here
LLM_BASE_URL=https://your-llm-provider-url/api
LLM_PLANNER_MODEL=your_planner_model_name
LLM_CRITIC_MODEL=your_critic_model_name
LLM_VERIFY_SSL=true

# Token limits
PLANNER_MAX_TOKENS=1600
CRITIC_MAX_TOKENS=900

# Jira synchronization
JIRA_SYNC_ENABLED=false
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token_here
JIRA_PROJECT_KEY=KAN
JIRA_ISSUE_TYPE=Task
JIRA_VERIFY_SSL=true
```

---

## ⚠️ Security Warning Before Pushing to GitHub

Before publishing this project, make sure you remove all real secrets from the codebase.

Do not expose:

- Jira API tokens
- LLM API keys
- Emails used for Jira authentication
- Private Atlassian domain names if the repository is public
- `.env` files
- Runtime files containing Jira issue links or project data

### Files that should not contain real secrets

Check and clean:

```text
execution_agent_with_mcp.py
launch.json
.env
agent_runtime.json
```

### If a token was already committed

If you already committed a real Jira token or API key:

1. Revoke the exposed token immediately
2. Generate a new token
3. Remove the token from the repository history if necessary
4. Move all secrets to environment variables
5. Add sensitive files to `.gitignore`

---

## ✅ Recommended `.gitignore`

Create a `.gitignore` file:

```gitignore
# Python
__pycache__/
*.pyc
*.pyo
*.pyd

# Virtual environments
.venv/
venv/
env/

# Environment files
.env
.env.local
.env.production

# IDE
.vscode/launch.json
.idea/

# Runtime files
agent_runtime.json

# Generated outputs
execution_agent_outputs/

# Jupyter
.ipynb_checkpoints/

# OS files
.DS_Store
Thumbs.db
```

---

## 🧾 Input File: `startup_state.json`

The agent starts from `startup_state.json`.

This file contains:

- Startup profile
- Objective
- Problem statement
- Target users
- MVP scope
- Execution context
- Product features
- Administrative workflow
- Deadlines
- Team members
- Skills
- Availability

Example:

```json
{
  "startup_profile": {
    "name": "MedLink",
    "objective": "Launch an MVP for an online doctor appointment booking platform",
    "problem_statement": "Patients need a simple way to find doctors, book appointments, and receive reminders.",
    "target_users": "Patients in urban areas and small private clinics",
    "mvp_scope_paragraph": "The MVP includes signup/login, doctor search, appointment booking, clinic dashboard, and reminder notifications.",
    "execution_context": "Small startup team building an MVP in 10 weeks with limited budget and aiming for pilot clinics."
  },
  "mvp_plan": {
    "features": [
      {
        "name": "User signup and authentication",
        "priority": "high"
      },
      {
        "name": "Doctor search and filtering",
        "priority": "high"
      }
    ],
    "admin_workflow": [
      {
        "name": "Legal registration",
        "priority": "high"
      }
    ],
    "deadlines": {
      "mvp_launch": "2026-07-15",
      "legal_deadline": "2026-06-01"
    }
  },
  "team": [
    {
      "name": "Sarah",
      "role": "Product Manager",
      "skills": ["planning", "requirements", "operations"],
      "availability": 1
    }
  ]
}
```

---

## ▶️ How to Run the Execution Agent

Run:

```bash
python execution_agent_with_mcp.py
```

The agent will:

1. Load the startup state
2. Load the local knowledge base
3. Initialize the LLM client
4. Initialize the MCP client
5. Synchronize runtime tasks from MCP
6. Retrieve relevant knowledge base patterns
7. Generate a plan using the Planner Agent
8. Normalize milestones and tasks
9. Build the dependency graph
10. Estimate durations
11. Compute priority and criticality scores
12. Assign tasks to team members
13. Compute feasibility
14. Detect anomalies
15. Run critic review
16. Decide actions
17. Persist tasks through MCP
18. Optionally sync with Jira
19. Generate a JSON execution result

---

## 📤 Output

After execution, the agent saves a JSON file inside:

```text
execution_agent_outputs/
```

Example:

```text
execution_agent_outputs/execution_result_MedLink.json
```

The JSON output includes:

- Startup name
- Updated execution state
- Task list
- Feasibility analysis
- Monitoring summary
- Priority tasks
- Blocked tasks
- Anomalies
- Critic report
- Jira sync result
- Recommended next actions
- Founder decisions
- Executive summary

---

## 📄 Generate the PDF Report

After running the main execution agent, run:

```bash
python pdf_report_generator.py
```

The PDF report will be generated inside:

```text
execution_agent_outputs/
```

Example:

```text
execution_agent_outputs/MedLink_Execution_Report.pdf
```

---

## 🔄 Jira Synchronization

Jira synchronization is controlled by:

```env
JIRA_SYNC_ENABLED=true
```

When enabled, the agent uses the MCP server to communicate with Jira.

Required variables:

```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token_here
JIRA_PROJECT_KEY=KAN
JIRA_ISSUE_TYPE=Task
JIRA_VERIFY_SSL=true
```

The agent can create or update Jira tasks with:

- Summary
- Description
- Priority
- Labels
- Owner metadata
- Estimated days
- Deadline
- Local status
- Dependency information
- Agent action reason

---

## 🧩 MCP Tools

The MCP server exposes project management tools such as:

```text
list_tasks
upsert_tasks
update_task_status
get_team_capacity
clear_runtime_tasks
sync_tasks_to_jira
fetch_jira_updates
```

These tools are called by the execution orchestrator through `mcp_client_adapter.py`.

---

## 🤖 A2A Agents

The local A2A system includes:

### Planner Agent

Responsible for generating or improving the execution plan.

### Critic Agent

Responsible for reviewing the plan and detecting issues, risks, missing dependencies, or weak execution decisions.

### Action Agent

Responsible for deciding what should happen to each task:

- create
- update
- transition
- reassign
- defer
- leave unchanged
- escalate

### Report Agent

Responsible for building executive summaries, owner action plans, and decision lists.

---

## 🧠 Knowledge Base Retrieval

The system uses a local knowledge base located in:

```text
structured_kb_sections/all_kb_records.json
```

The retrieval process uses:

- Embedding model: `sentence-transformers/all-MiniLM-L6-v2`
- Reranker model: `cross-encoder/ms-marco-MiniLM-L6-v2`
- Top-k retrieval
- Reranking
- Compact retrieved context for planning

If the knowledge base file does not exist, the system can still run, but planning quality may be reduced.

---

## 📊 Execution Logic

The agent performs several reasoning steps:

### 1. Task Normalization

Converts milestones and planner output into internal task objects.

### 2. Dependency Graph

Uses task dependencies to build a graph and identify ready tasks.

### 3. Estimation

Computes estimated duration based on task complexity, priority, and category.

### 4. Priority Scoring

Computes a score based on urgency, importance, dependency impact, and deadlines.

### 5. Assignment

Assigns tasks based on:

- Team skills
- Workload
- Task category
- Continuity
- Availability

### 6. Feasibility

Analyzes whether the execution plan is realistic compared to deadlines.

### 7. Anomaly Detection

Detects problems such as:

- Blocked tasks
- Delayed tasks
- Missing owners
- Dependency problems
- Overloaded team members

### 8. Jira Action Decision

Decides the correct action for each task before Jira synchronization.

---

## 🧪 Example Workflow

```bash
# 1. Create virtual environment
python -m venv .venv

# 2. Activate environment on Windows
.venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
copy .env.example .env

# 5. Run the execution agent
python execution_agent_with_mcp.py

# 6. Generate the PDF report
python pdf_report_generator.py
```

---

## 🧪 Suggested Tests

Recommended unit tests:

```text
tests/
├── test_status_normalization.py
├── test_priority_scoring.py
├── test_dependency_graph.py
├── test_task_assignment.py
├── test_jira_action_decision.py
└── test_runtime_storage.py
```

Useful test cases:

- Normalize Jira statuses correctly
- Detect dependency cycles
- Compute priority scores
- Assign tasks to the best matching owner
- Avoid assigning too many tasks to one member
- Skip Jira sync when credentials are missing
- Generate valid JSON output

---

## 🐞 Troubleshooting

### Problem: Jira sync is skipped

Check:

```env
JIRA_SYNC_ENABLED=true
```

Also verify:

```env
JIRA_BASE_URL
JIRA_USER_EMAIL
JIRA_API_TOKEN
JIRA_PROJECT_KEY
```

---

### Problem: Jira authentication fails

Possible causes:

- Invalid Jira API token
- Wrong Jira email
- Wrong Atlassian domain
- Missing project permissions
- Incorrect project key

---

### Problem: Knowledge base file not found

Make sure this file exists:

```text
structured_kb_sections/all_kb_records.json
```

If it does not exist, run the knowledge base pipeline notebook or create the structured KB manually.

---

### Problem: PDF report generation fails

Make sure the execution result exists:

```text
execution_agent_outputs/execution_result_MedLink.json
```

Then run:

```bash
python pdf_report_generator.py
```

---

### Problem: Sentence Transformer model downloads slowly

The first run may take time because the embedding and reranking models need to be downloaded.

---

## 📌 Current Limitations

- A2A is local and in-process, not distributed
- Runtime state is stored in JSON instead of a database
- Jira integration depends on correct credentials and permissions
- The fallback planner is rule-based
- More unit tests are needed
- Error handling can be improved for corrupted JSON runtime files
- The PDF report input path is currently fixed in the script and may need to be made configurable

---

## 🚧 Future Improvements

- Add a web dashboard
- Add database persistence
- Add FastAPI backend
- Add real-time Jira webhook support
- Add Docker support
- Add CI/CD pipeline
- Add unit and integration tests
- Add configurable PDF input/output paths
- Add better logging
- Add user authentication
- Add multi-project support
- Add advanced explainability for task prioritization
- Add LIME/SHAP-based explanations for priority decisions

---

## 🎓 Academic Value

This project demonstrates:

- Agentic AI workflow orchestration
- MCP-based tool usage
- Local multi-agent collaboration
- Jira automation
- Project execution planning
- Task prioritization
- Skill-based task assignment
- Dependency graph analysis
- Risk detection
- Feasibility analysis
- Automated report generation

---

## 🧑‍💻 Author

Developed as part of an AI-powered execution management project.

---

## 📜 License

This project is provided for academic and educational purposes.

You may add a license such as:

```text
MIT License
```

or keep it private depending on your project requirements.

---

## ✅ Final Safety Checklist Before GitHub Push

Before pushing:

- [ ] Remove real Jira tokens
- [ ] Remove real LLM API keys
- [ ] Remove real emails if repository is public
- [ ] Add `.env` to `.gitignore`
- [ ] Add `launch.json` to `.gitignore`
- [ ] Add `agent_runtime.json` to `.gitignore`
- [ ] Add `execution_agent_outputs/` to `.gitignore`
- [ ] Create `.env.example`
- [ ] Create `requirements.txt`
- [ ] Test the project locally
- [ ] Push only clean code

```bash
git status
git add .
git commit -m "Add execution agent with MCP, A2A and Jira integration"
git push origin main
```
