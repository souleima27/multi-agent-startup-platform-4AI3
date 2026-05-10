# Startup AI Operating System

### Multi-Agent AI Platform for Startup Creation, Validation, and Growth

> **This project, Startup AI Operating System, was developed as part of the coursework for the Software Engineering program at [Esprit School of Engineering](https://esprit.tn).** It was built to explore the intersection of multi-agent AI systems, startup ecosystems, and intelligent automation for entrepreneurship.

An **intelligent multi-agent platform** that helps founders transform startup ideas into viable businesses by combining **multimodal AI, structured reasoning agents, and ecosystem intelligence**.

The system evaluates startup feasibility, guides legal setup, generates execution plans, optimizes pitches, and connects founders with investors and mentors.

This project implements a **modular AI architecture where specialized agents collaborate through orchestration workflows and shared memory.**

---

## Topics

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Artificial Intelligence](https://img.shields.io/badge/artificial--intelligence-%23FF6F00?style=for-the-badge)
![Machine Learning](https://img.shields.io/badge/machine--learning-%2300C853?style=for-the-badge)
![Multi-Agent Systems](https://img.shields.io/badge/multi--agent--systems-%23673AB7?style=for-the-badge)
![Web Development](https://img.shields.io/badge/web--development-%23E44D26?style=for-the-badge)
![Data Analysis](https://img.shields.io/badge/data--analysis-%230288D1?style=for-the-badge)
![Deep Learning](https://img.shields.io/badge/deep--learning-%23FF5722?style=for-the-badge)
![NLP](https://img.shields.io/badge/nlp-%234CAF50?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

**GitHub Topics:** `python` · `artificial-intelligence` · `machine-learning` · `multi-agent-systems` · `deep-learning` · `nlp` · `web-development` · `data-analysis` · `fastapi` · `react` · `startup` · `llm` · `automation` · `esprit-school-of-engineering`

---

## Table of Contents

- [Overview](#overview)
- [Academic Context](#academic-context)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [AI Tracks](#ai-tracks)
  - [Track A — Idea & Feasibility](#track-a--idea--feasibility)
  - [Track B — Legal & Administrative](#track-b--legal--administrative)
  - [Track C — Execution & Automation](#track-c--execution--automation)
- [Frontend ](#frontend)
- [Multimodal Processing](#multimodal-processing)
- [Startup_State Memory System](#startup_state-memory-system)
- [Repository Structure](#repository-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Running the System](#running-the-system)
- [Hosting & Deployment](#hosting--deployment)
- [Development Workflow](#development-workflow)
- [Example Workflow](#example-workflow)
- [Acknowledgments](#acknowledgments)
- [License](#license)

---

## Overview

Building a startup requires navigating multiple complex dimensions simultaneously:

- Idea validation and market analysis
- Financial planning and revenue projections
- Legal setup and regulatory compliance
- Product execution and task automation
- Investor networking and pitch optimization

This platform acts as a **Startup Operating System**, coordinating multiple AI agents to support founders throughout the entire lifecycle of their startup — from idea to execution.

The system integrates:

- **Multimodal data ingestion** (text, PDF, images, audio, slides)
- **Knowledge graph-based memory** for ecosystem reasoning
- **Agent orchestration via A2A and MCP protocols**
- **Automated reasoning workflows** powered by LLMs (Large Language Models)
- **Real-time Jira synchronization** for agile project management
- **Natural Language Processing (NLP)** for pitch analysis and document understanding

---

## Academic Context

This project was developed as part of the **Software Engineering** program at **Esprit School of Engineering**, Tunisia.

It was designed to demonstrate the practical application of:
- **Artificial Intelligence** and **machine learning** in entrepreneurship support tools
- **Multi-agent system design** using A2A (Agent-to-Agent) and MCP (Model Context Protocol) architectures
- **Full-stack web development** with React, Vite, FastAPI, and Streamlit
- **Data analysis** and **data visualization** for startup metrics and feasibility scoring
- **Deep learning** models for audio transcription, vocal analysis, and document OCR

> **Esprit School of Engineering** — Building tomorrow's engineers through innovation and practical excellence.

---

## Key Features

### AI Feasibility Analysis

Evaluates startup ideas through **market analysis**, financial modeling, and strategic reasoning. Produces a feasibility score, market opportunity analysis, MVP roadmap, and a GO / ITERATE / NO-GO decision. Leverages **machine learning** and **data analysis** to benchmark against existing solutions.

### Legal Navigation

Guides founders through the startup legal structure and Tunisian regulatory requirements, including eligibility for the **Startup Act** and the probability of obtaining the **Startup Label**. Uses intelligent document analysis with **OCR** and **NLP**.

### Automated Execution Planning

Generates MVP plans, sprints, and operational workflows using **AI-driven task automation**. Assigns tasks to team members based on skills and availability, and synchronizes with **Jira** via MCP for agile project management.

### Pitch Optimization

Analyzes pitch videos, audio, and slides to improve investor communication. Leverages **deep learning** (Whisper, MediaPipe) and **NLP** to generate detailed coaching reports in JSON, Markdown, and PDF formats.

### Investor & Mentor Matching

Identifies relevant investors, mentors, and networking opportunities using **AI-based recommendation** and ecosystem intelligence.

### Continuous Risk Monitoring

Tracks financial, operational, and strategic risk signals using **data analysis** and scoring algorithms.

---

## System Architecture

The platform follows a **layered architecture designed for scalable AI agent systems** and **cloud-native deployment**.

```
User Interface (STARTI — React + Vite)
        ↓
Backend API Layer (FastAPI / Streamlit)
        ↓
Multimodal Processing Layer (NLP, OCR, Audio, Vision)
        ↓
Startup_State Memory System (Graph + Vector + JSON)
        ↓
Agent Orchestration Layer (A2A + MCP)
        ↓
Track-Based Agent Execution (Python AI Agents)
        ↓
Decision & Monitoring Layer
```

Each layer plays a specialized role in transforming founder inputs into actionable startup insights using **artificial intelligence** and **automation**.

---

## AI Tracks

The system organizes AI capabilities into **three specialized tracks**, each powered by dedicated **Python** AI agents and **machine learning** pipelines.

---

### Track A — Idea & Feasibility

**Directory:** `Track1/`
**Interface:** Streamlit application (`app.py`)
**Pipeline:** `final_startup_report_pipeline.py` → `final_reporter.py`

Evaluates the startup concept and determines business viability using **market analysis**, **data analysis**, and **AI-driven feasibility scoring**.

#### Included Agents

| Agent | File | Role |
|---|---|---|
| Research Agent | `research_ag.py` | Market analysis and web research |
| Search Web Results | `search_web_results_ag.py` | Web data retrieval |
| Exist. Solutions Agent | `exist_sol_ag.py` | Detection of existing solutions |
| Company Description | `company_description_clear_ag.py` | Description writing |
| Company Name Extractor | `company_name_extractor_ag.py` | Key information extraction |
| Revenue Agent | `revenue_ag.py` | Revenue projections |
| Cost Agent | `cost_ag.py` | Cost analysis |
| Manager Agent | `manager_ag.py` | Pipeline orchestration |
| Final Reporter | `final_reporter.py` | Final feasibility report |

#### Protocols

- **A2A**: inter-agent communication bus (`a2a_server.py`, `a2a_tool_wrappers.py`)
- **MCP**: search and data tools (`mcp_server.py`, `mcp_tool_wrappers.py`)

#### Outputs

- Feasibility score
- Market opportunity analysis
- MVP roadmap
- Financial projections
- Decision: **GO / ITERATE / NO-GO**

#### Launch

```bash
cd Track1
pip install -r requirements.txt
streamlit run app.py
```

---

### Track B — Legal & Administrative

**Directory:** `Track2/`
**API:** FastAPI (`app/api/main.py`)
**CLI Runner:** `app/run/run_agent2.py`

Guides founders through startup creation and Tunisian regulatory processes using **intelligent document analysis**, **NLP**, and **OCR** technology.

#### Included Agents

| Agent | File | Role |
|---|---|---|
| Strategic Legal Agent | `app/agents/strategic_legal_agent.py` | Legal form recommendation, Startup Act score |
| Intelligent Document Agent | `app/agents/intelligent_document_agent.py` | Multi-format document analysis |
| Legal Classification | `app/agents/legal_classification.py` | Legal classification |
| Document Verification | `app/agents/document_verification.py` | Document verification |
| Administrative Workflow | `app/agents/administrative_workflow.py` | Administrative workflow |
| Startup Label Simulation | `app/agents/startup_label_simulation.py` | Startup Label simulation |
| Document Management | `app/agents/document_management.py` | Document management |

#### Supported Formats

- Images: `.png`, `.jpg`, `.jpeg`, `.bmp`, `.tif`, `.tiff`, `.webp`
- PDF: `.pdf`
- Word: `.docx`
- PowerPoint: `.pptx`

#### Outputs

- Legal form recommendation
- Startup Act score
- Startup Label probability
- Compliance checklist
- Document completeness score
- Decision: **GO / NO_GO / PASS / WARNING / FAIL**
- JSON report and PDF report

#### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Service status |
| POST | `/track-b/run` | Full pipeline |
| POST | `/agents/a1/strategic-assessment` | Strategic legal agent |
| POST | `/agents/a2/document-intelligence` | Document agent |

#### Launch

```bash
cd Track2
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Start the API
uvicorn app.api.main:app --reload

# Or via the CLI runner
python -m app.run.run_agent2 request_strict.json
```

#### Configuration

Environment variables (`.env`):

```env
LLM_BASE_URL=http://localhost:11434  # Ollama-compatible server URL
LLM_MODEL=deepseek-r1:7b
LLM_TIMEOUT_SECONDS=120
```

---

### Track C — Execution & Automation

**Directory:** `Track3/`

This track is composed of **two sub-systems** for full startup execution support and **pitch analysis**.

---

#### Track C.1 — Execution Agent

**Directory:** `Track3/ExecutionAgent/`
**Entry point:** `execution_agent_with_mcp.py`

An **AI project management agent** that transforms a startup MVP plan into a structured, trackable execution workflow. Combines **multi-agent systems**, **automation**, and **Jira integration** for real-time task management.

##### Local A2A Agents

| Agent | Role |
|---|---|
| Planner Agent | Generates or improves the execution plan |
| Critic Agent | Reviews the plan and detects weaknesses |
| Action Agent | Decides the action to apply to each task |
| Report Agent | Builds executive summaries and decision lists |

##### Exposed MCP Tools

```text
list_tasks           — list runtime tasks
upsert_tasks         — create or update tasks
update_task_status   — update a task status
get_team_capacity    — retrieve team capacity
clear_runtime_tasks  — clear the runtime
sync_tasks_to_jira   — synchronize to Jira
fetch_jira_updates   — fetch Jira updates
```

##### Features

- Automatic milestone and task generation using **AI planning**
- Duration estimation and priority scoring via **machine learning**
- Dependency graph construction (NetworkX) — **data visualization**
- Task assignment based on skills and availability
- Anomaly detection (blocked tasks, overloaded members)
- Jira synchronization via MCP for **agile automation**
- Pattern retrieval from a local knowledge base (Sentence Transformers + Cross Encoder) — **deep learning**
- PDF report generation (ReportLab)

##### Launch

```bash
cd Track3/ExecutionAgent
python -m venv .venv
.venv\Scripts\activate
pip install pandas networkx httpx openai sentence-transformers reportlab mcp python-dotenv

# Configure the environment
copy .env.example .env

# Run the agent
python execution_agent_with_mcp.py

# Generate the PDF report
python pdf_report_generator.py
```

##### Environment Variables

```env
MODEL_MODE=hybride
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://your-llm-provider-url/api
LLM_PLANNER_MODEL=your_planner_model
LLM_CRITIC_MODEL=your_critic_model

# Jira (optional)
JIRA_SYNC_ENABLED=false
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=KAN
```

---

#### Track C.2 — Agentic Pitch Coach

**Directory:** `Track3/pitch/`
**Entry point:** `agentic_pitch_coach.py`

A local **Python** tool that analyzes a pitch video and produces detailed coaching based on the transcript, delivery signals, visual cues, and vocal assurance. Powered by **deep learning**, **NLP**, and **multimodal AI processing**.

##### Analysis Pipeline

1. Audio extraction from the local video
2. Transcription with `faster-whisper` — **speech recognition / deep learning**
3. Delivery scoring (pace, filler words, energy, sentence length) — **NLP / data analysis**
4. Content and narrative analysis via OpenAI-compatible LLM — **artificial intelligence**
5. *(Optional)* Video frame analysis with OpenCV and MediaPipe — **computer vision**
6. *(Optional)* Vocal assurance timeline with a Hugging Face model — **machine learning**
7. JSON, Markdown, and PDF report generation — **data visualization**

##### Available Coaching Modes

`investor` · `sales` · `demo_day` · `class_presentation` · `founder_story`

##### Launch

```bash
cd Track3/pitch
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements_pitch_coach.txt

# Full analysis
python agentic_pitch_coach.py --video ./my_pitch.mp4 --output ./output

# Lightweight run (without heavy models)
python agentic_pitch_coach.py --video ./my_pitch.mp4 --whisper-size tiny --skip-visual --skip-voice-emotion
```

##### MCP Server

```bash
python mcp_pitch_coach_server.py
```

Exposed MCP tools: `pitch_coach_defaults`, `analyze_pitch_video`

---

## Frontend — STARTI

**Directory:** `Template/`
**Stack:** React + Vite

Modern landing page for the platform with user and data management. Implements **responsive web development** best practices with dark mode and micro-interactions.

### Features

- Responsive SaaS-style landing page with dark mode and micro-interactions
- Signup / Login authentication via Supabase Auth
- Contact form and newsletter storage (Supabase)
- Pricing plan selection capture
- Testimonials with submission and moderation
- Animated counters, FAQ accordion, smooth animations
- Safe local fallback when Supabase keys are not configured

### Launch

```bash
cd Template
cp .env.example .env
npm install
npm run dev
```


## Multimodal Processing

The system accepts multiple input types, enabling **multimodal AI** analysis across text, audio, visual, and document data.

### Supported Inputs

- Text descriptions
- PDF documents
- Slides (PPTX)
- Financial spreadsheets
- Audio pitch recordings
- Images and screenshots

### Processing Pipelines

**Audio — Speech Recognition & Deep Learning**
- Speech-to-text transcription (`faster-whisper`)
- Sentiment analysis via **NLP**
- Vocal confidence detection with **machine learning**

**Documents — OCR & NLP**
- OCR extraction (`pytesseract`) — **data extraction / automation**
- Layout parsing
- Financial data extraction (PDF, DOCX, PPTX)

**Slides & Images — Computer Vision**
- Visual structure detection
- Chart analysis — **data visualization**
- Image-text embeddings via **deep learning**

All extracted information is converted into structured semantic blocks used by the **multi-agent** system.

---

## Startup_State Memory System

The platform maintains a **context-augmented memory system** combining three storage layers for intelligent **data analysis** and retrieval.

### Graph Memory

Stores relationships between entities:
- founders
- startups
- markets
- competitors
- investors

Used for ecosystem reasoning and **knowledge graph** traversal.

### Vector Memory

Stores semantic embeddings for:
- market claims
- financial assumptions
- legal statements
- investor interactions

Used for contextual retrieval via **semantic search** and **NLP**.

### Structured State (startup_state.json)

Stores system metrics:
- feasibility scores
- survival probability
- legal status
- milestone progress
- risk flags

Each memory update includes timestamps and confidence scores to maintain consistency and enable **data analysis** over time.

---

## Repository Structure

```
multi-agent-startup-platform-4AI3/
│
├── Track1/                          # Track A — Idea & Feasibility
│   ├── app.py                       # Streamlit interface
│   ├── final_startup_report_pipeline.py
│   ├── final_reporter.py
│   ├── manager_ag.py
│   ├── research_ag.py
│   ├── revenue_ag.py / cost_ag.py
│   ├── exist_sol_ag.py
│   ├── a2a_server.py / a2a_tool_wrappers.py
│   ├── mcp_server.py / mcp_tool_wrappers.py
│   ├── requirements.txt
│   └── outputs/
│
├── Track2/                          # Track B — Legal & Administrative
│   ├── app/
│   │   ├── agents/                  # AI agents
│   │   │   ├── strategic_legal_agent.py
│   │   │   ├── intelligent_document_agent.py
│   │   │   └── ...
│   │   ├── api/                     # FastAPI endpoints
│   │   ├── core/                    # Config and settings
│   │   ├── mcp/                     # Local MCP server
│   │   ├── models/                  # Data models
│   │   ├── run/                     # CLI runners
│   │   ├── services/                # Orchestrator, OCR, LLM client
│   │   └── utils/
│   ├── data/                        # Knowledge base (kb_master.json)
│   ├── sample_data/
│   ├── requirements.txt
│   └── request_strict.json
│
├── Track3/                          # Track C — Execution & Automation
│   ├── ExecutionAgent/
│   │   ├── execution_agent_with_mcp.py   # Main orchestrator
│   │   ├── mcp_startup_server.py         # MCP server + Jira
│   │   ├── mcp_client_adapter.py
│   │   ├── a2a_protocol.py               # Local A2A bus
│   │   ├── a2a_agents.py                 # Planner, Critic, Action, Report
│   │   ├── pdf_report_generator.py
│   │   ├── startup_state.json
│   │   ├── structured_kb_sections/       # Local knowledge base
│   │   └── execution_agent_outputs/
│   │
│   └── pitch/
│       ├── agentic_pitch_coach.py        # Main pitch coach
│       ├── mcp_pitch_coach_server.py     # Pitch MCP server
│       ├── requirements_pitch_coach.txt
│       └── output/
│
├── Template/                        # Frontend — Venture Path (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── styles.css
│   ├── supabase/
│   ├── index.html
│   └── package.json
│
└── StorageSystem/                   # Shared storage system (WIP)
```

---

## Technology Stack

### Frontend — Web Development

| Technology | Usage |
|---|---|
| React + Vite | Venture Path user interface — **web development** |
| Supabase | Auth, database, storage |
| CSS (vanilla) | Styles, dark mode, animations |

### Backend & Agents — Python & AI

| Technology | Usage |
|---|---|
| Python | AI agents, pipelines, API — **core language** |
| FastAPI | Track B REST API — **web development / automation** |
| Streamlit | Track A interface — **data visualization** |
| A2A Protocol | Inter-agent communication bus — **multi-agent systems** |
| MCP (Model Context Protocol) | Bridge between agents and external tools |
| Jira REST API | Task synchronization — **automation** |

### AI & Data — Machine Learning & Deep Learning

| Technology | Usage |
|---|---|
| OpenAI-compatible LLM | Reasoning and generation — **artificial intelligence** (Ollama, vLLM) |
| faster-whisper | Audio transcription — **deep learning / speech recognition** |
| Sentence Transformers | Semantic embeddings — **NLP / machine learning** |
| Cross Encoder | Retrieval reranking — **deep learning** |
| MediaPipe + OpenCV | Pitch visual analysis — **computer vision** |
| pytesseract | Document OCR — **data extraction** |
| NetworkX | Dependency graph — **data analysis / data visualization** |
| ReportLab | PDF generation — **automation** |


## Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### Clone the Repository

```bash
git clone https://github.com/your-org/startup-ai-os.git
cd startup-ai-os
```

### OCR (Track B — Windows)

Install the Tesseract OCR binary, then verify:

```bash
tesseract --version
```

If Tesseract is not available, the system automatically falls back to a lightweight extraction mode.

---

## Running the System

Each track is independent and can be launched separately.

### Track A (Feasibility)

```bash
cd Track1
pip install -r requirements.txt
streamlit run app.py
```

### Track B (Legal)

```bash
cd Track2
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.api.main:app --reload
```

### Track C — Execution Agent

```bash
cd Track3/ExecutionAgent
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
python execution_agent_with_mcp.py
```

### Track C — Pitch Coach

```bash
cd Track3/pitch
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements_pitch_coach.txt
python agentic_pitch_coach.py --video ./my_pitch.mp4
```

### Frontend — STARTI


```bash
cd Template
npm install
npm run dev
```

---

## Hosting & Deployment

This project is hosted as a **public GitHub repository** and leverages the **GitHub Education for Students** program for cloud deployment benefits.

### GitHub Education — Student Benefits

As a student at **Esprit School of Engineering**, this project takes advantage of the [GitHub Education Student Developer Pack](https://education.github.com/pack), which provides access to industry-leading hosting and infrastructure platforms:

| Platform | Benefit | Usage in this Project |
|---|---|---|
| **Heroku** | Free Dyno credits | Backend API deployment (FastAPI, Streamlit) |
| **DigitalOcean** | $200 free credit | VPS hosting for AI workloads and GPU instances |
| **Namecheap** | Free domain registration | Custom domain for the STARTI frontend |
| **GitHub Actions** | Free CI/CD minutes | Automated testing and deployment pipelines |

### Recommended Deployment Architecture

- **Frontend (STARTI):** Deploy via Vercel or Namecheap hosting (React + Vite static build)
- **Track A (Streamlit):** Deploy on Heroku or DigitalOcean Droplet
- **Track B (FastAPI):** Containerize with Docker, deploy on DigitalOcean App Platform
- **Track C (AI Agents):** GPU-enabled DigitalOcean Droplet for Whisper, Sentence Transformers
- **Database / Auth:** Supabase (managed cloud)

### Containerization

```bash
# Build and run with Docker
docker build -t startup-ai-os .
docker run -p 8000:8000 startup-ai-os
```

> ⚠️ **Security**: Never commit `.env` files, Jira tokens, LLM API keys, or runtime files containing sensitive data to a public repository.

---

## Development Workflow

The project follows a structured Git workflow.

### Branches

```
main          — stable branch
dev           — development branch
feature/*     — new features
```

### Feature Branch Examples

```
feature/market-intelligence-agent
feature/investor-matching
feature/pitch-analysis
```

All new features should be merged through **Pull Requests**.

---

## Example Workflow

1. Founder uploads their startup idea and pitch via Venture Path.
2. The **multimodal AI** pipeline extracts structured knowledge from text, audio, and documents.
3. Track A agents evaluate business viability using **machine learning** and **data analysis**.
4. Track B agents generate the regulatory roadmap with **NLP** and **OCR**.
5. The Execution Agent (Track C) creates the operational plan and syncs with Jira via **automation**.
6. The Pitch Coach (Track C) analyzes the presentation using **deep learning** and generates detailed coaching.
7. The system generates comprehensive startup insights with **data visualization** and PDF reports.

---

## Acknowledgments

This project was developed as part of the **Software Engineering** curriculum at **Esprit School of Engineering**, Tunisia.

> **Esprit School of Engineering** — École Supérieure Privée d'Ingénierie et de Technologies  
> 🌐 [https://esprit.tn](https://esprit.tn)

Special thanks to the teaching staff and academic supervisors at **Esprit School of Engineering** for their guidance throughout the development of this **multi-agent AI platform**.

This project was made possible in part through resources provided by the **GitHub Education for Students** program.

---

## License

This project is distributed under the MIT License. See the [LICENSE](./LICENSE) file for details.
