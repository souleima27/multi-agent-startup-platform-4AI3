# Startup AI Operating System

### Plateforme Multi-Agents IA pour la Création, Validation et Croissance de Startups

Une **plateforme multi-agents intelligente** qui aide les fondateurs à transformer leurs idées en entreprises viables en combinant **IA multimodale, agents de raisonnement structurés et intelligence d'écosystème**.

Le système évalue la faisabilité d'une startup, guide la création juridique, génère des plans d'exécution, optimise les pitchs et connecte les fondateurs aux investisseurs et mentors.

Ce projet implémente une **architecture IA modulaire où des agents spécialisés collaborent via des workflows d'orchestration et une mémoire partagée.**

---

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités Clés](#fonctionnalités-clés)
- [Architecture du Système](#architecture-du-système)
- [Tracks IA](#tracks-ia)
  - [Track A — Idée & Faisabilité](#track-a--idée--faisabilité)
  - [Track B — Juridique & Administratif](#track-b--juridique--administratif)
  - [Track C — Exécution & Automatisation](#track-c--exécution--automatisation)
- [Frontend — Venture Path](#frontend--venture-path)
- [Traitement Multimodal](#traitement-multimodal)
- [Système Mémoire Startup_State](#système-mémoire-startup_state)
- [Structure du Dépôt](#structure-du-dépôt)
- [Stack Technologique](#stack-technologique)
- [Installation](#installation)
- [Lancement du Système](#lancement-du-système)
- [Workflow de Développement](#workflow-de-développement)
- [Workflow Exemple](#workflow-exemple)
- [Déploiement](#déploiement)
- [Licence](#licence)

---

## Vue d'ensemble

Construire une startup nécessite de naviguer simultanément sur plusieurs dimensions complexes :

- Validation d'idée
- Analyse de marché
- Planification financière
- Création juridique
- Exécution produit
- Réseau investisseurs

Cette plateforme agit comme un **Startup Operating System**, coordonnant plusieurs agents IA pour accompagner les fondateurs tout au long du cycle de vie complet de leur startup.

Le système intègre :

- **Ingestion de données multimodales** (texte, PDF, images, audio, slides)
- **Mémoire à base de graphes de connaissance**
- **Orchestration d'agents via protocoles A2A et MCP**
- **Workflows de raisonnement automatisés**

---

## Fonctionnalités Clés

### Analyse de Faisabilité IA

Évalue les idées de startup via une analyse de marché, financière et stratégique. Produit un score de faisabilité, une analyse d'opportunité marché, un roadmap MVP et une décision GO / ITERATE / NO-GO.

### Navigation Juridique

Guide les fondateurs à travers la structure juridique de la startup et les exigences réglementaires tunisiennes, incluant l'éligibilité au **Startup Act** et la probabilité d'obtention du **Startup Label**.

### Planification d'Exécution Automatisée

Génère des plans MVP, des sprints, des workflows opérationnels, assigne des tâches aux membres de l'équipe et synchronise avec **Jira** via MCP.

### Optimisation de Pitch

Analyse les pitchs vidéo, l'audio et les slides pour améliorer la communication investisseur. Génère des rapports de coaching détaillés en JSON, Markdown et PDF.

### Matching Investisseurs & Mentors

Identifie les investisseurs, mentors et opportunités de networking pertinents.

### Surveillance Continue des Risques

Suit les signaux de risques financiers, opérationnels et stratégiques.

---

## Architecture du Système

La plateforme suit une **architecture en couches conçue pour les systèmes d'agents IA scalables**.

```
Interface Utilisateur (Venture Path — React + Vite)
        ↓
Couche API Backend (FastAPI / Streamlit)
        ↓
Couche de Traitement Multimodal
        ↓
Système Mémoire Startup_State
        ↓
Couche d'Orchestration des Agents (A2A + MCP)
        ↓
Exécution des Agents par Track
        ↓
Couche Décision & Monitoring
```

Chaque couche joue un rôle spécialisé dans la transformation des entrées du fondateur en insights startup actionnables.

---

## Tracks IA

Le système organise les capacités IA en **quatre tracks spécialisées**.

---

### Track A — Idée & Faisabilité

**Répertoire :** `Track1/`
**Interface :** Application Streamlit (`app.py`)
**Pipeline :** `final_startup_report_pipeline.py` → `final_reporter.py`

Évalue le concept startup et détermine la viabilité business.

#### Agents inclus

| Agent | Fichier | Rôle |
|---|---|---|
| Research Agent | `research_ag.py` | Analyse marché et recherche web |
| Search Web Results | `search_web_results_ag.py` | Récupération de données web |
| Exist. Solutions Agent | `exist_sol_ag.py` | Détection des solutions existantes |
| Company Description | `company_description_clear_ag.py` | Rédaction descriptions |
| Company Name Extractor | `company_name_extractor_ag.py` | Extraction d'informations clés |
| Revenue Agent | `revenue_ag.py` | Projections de revenus |
| Cost Agent | `cost_ag.py` | Analyse des coûts |
| Manager Agent | `manager_ag.py` | Orchestration du pipeline |
| Final Reporter | `final_reporter.py` | Rapport de faisabilité final |

#### Protocoles

- **A2A** : bus de communication inter-agents (`a2a_server.py`, `a2a_tool_wrappers.py`)
- **MCP** : outils de recherche et de données (`mcp_server.py`, `mcp_tool_wrappers.py`)

#### Sorties

- Score de faisabilité
- Analyse d'opportunité de marché
- Roadmap MVP
- Projections financières
- Décision : **GO / ITERATE / NO-GO**

#### Lancement

```bash
cd Track1
pip install -r requirements.txt
streamlit run app.py
```

---

### Track B — Juridique & Administratif

**Répertoire :** `Track2/`
**API :** FastAPI (`app/api/main.py`)
**Runner CLI :** `app/run/run_agent2.py`

Guide les fondateurs à travers la création de startup et les processus réglementaires tunisiens.

#### Agents inclus

| Agent | Fichier | Rôle |
|---|---|---|
| Strategic Legal Agent | `app/agents/strategic_legal_agent.py` | Recommandation forme juridique, score Startup Act |
| Intelligent Document Agent | `app/agents/intelligent_document_agent.py` | Analyse documentaire multi-format |
| Legal Classification | `app/agents/legal_classification.py` | Classification juridique |
| Document Verification | `app/agents/document_verification.py` | Vérification de documents |
| Administrative Workflow | `app/agents/administrative_workflow.py` | Workflow administratif |
| Startup Label Simulation | `app/agents/startup_label_simulation.py` | Simulation du Startup Label |
| Document Management | `app/agents/document_management.py` | Gestion documentaire |

#### Formats supportés

- Images : `.png`, `.jpg`, `.jpeg`, `.bmp`, `.tif`, `.tiff`, `.webp`
- PDF : `.pdf`
- Word : `.docx`
- PowerPoint : `.pptx`

#### Sorties

- Recommandation de forme juridique
- Score Startup Act
- Probabilité d'obtention du Startup Label
- Checklist de conformité
- Score de complétude documentaire
- Décision : **GO / NO_GO / PASS / WARNING / FAIL**
- Rapport JSON et rapport PDF

#### Endpoints API

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/health` | Statut du service |
| POST | `/track-b/run` | Pipeline complet |
| POST | `/agents/a1/strategic-assessment` | Agent juridique stratégique |
| POST | `/agents/a2/document-intelligence` | Agent documentaire |

#### Lancement

```bash
cd Track2
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Lancer l'API
uvicorn app.api.main:app --reload

# Ou via le runner CLI
python -m app.run.run_agent2 request_strict.json
```

#### Configuration

Variables d'environnement (`.env`) :

```env
LLM_BASE_URL=http://localhost:11434  # URL serveur Ollama compatible
LLM_MODEL=deepseek-r1:7b
LLM_TIMEOUT_SECONDS=120
```

---

### Track C — Exécution & Automatisation

**Répertoire :** `Track3/`

Ce track est composé de **deux sous-systèmes** :

---

#### Track C.1 — Execution Agent

**Répertoire :** `Track3/ExecutionAgent/`
**Point d'entrée :** `execution_agent_with_mcp.py`

Agent IA de gestion de projet qui transforme un plan MVP startup en workflow d'exécution structuré et traçable.

##### Agents A2A locaux

| Agent | Rôle |
|---|---|
| Planner Agent | Génère ou améliore le plan d'exécution |
| Critic Agent | Revoit le plan et détecte les faiblesses |
| Action Agent | Décide l'action à appliquer à chaque tâche |
| Report Agent | Construit les résumés exécutifs et listes de décisions |

##### Outils MCP exposés

```text
list_tasks           — lister les tâches runtime
upsert_tasks         — créer ou mettre à jour les tâches
update_task_status   — mettre à jour le statut d'une tâche
get_team_capacity    — récupérer la capacité de l'équipe
clear_runtime_tasks  — vider le runtime
sync_tasks_to_jira   — synchroniser vers Jira
fetch_jira_updates   — récupérer les mises à jour Jira
```

##### Fonctionnalités

- Génération automatique de milestones et tâches
- Estimation de durée et scoring de priorité
- Construction du graphe de dépendances (NetworkX)
- Assignation des tâches selon les compétences et la disponibilité
- Détection d'anomalies (tâches bloquées, membres surchargés)
- Synchronisation Jira via MCP
- Récupération de patterns depuis une base de connaissances locale (Sentence Transformers + Cross Encoder)
- Génération de rapport PDF (ReportLab)

##### Lancement

```bash
cd Track3/ExecutionAgent
python -m venv .venv
.venv\Scripts\activate
pip install pandas networkx httpx openai sentence-transformers reportlab mcp python-dotenv

# Configurer l'environnement
copy .env.example .env

# Lancer l'agent
python execution_agent_with_mcp.py

# Générer le rapport PDF
python pdf_report_generator.py
```

##### Variables d'environnement

```env
MODEL_MODE=hybride
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://your-llm-provider-url/api
LLM_PLANNER_MODEL=your_planner_model
LLM_CRITIC_MODEL=your_critic_model

# Jira (optionnel)
JIRA_SYNC_ENABLED=false
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=KAN
```

---

#### Track C.2 — Agentic Pitch Coach

**Répertoire :** `Track3/pitch/`
**Point d'entrée :** `agentic_pitch_coach.py`

Outil Python local qui analyse une vidéo de pitch et produit un coaching détaillé basé sur la transcription, les signaux de delivery, les indices visuels et vocaux.

##### Pipeline d'analyse

1. Extraction audio depuis la vidéo locale
2. Transcription avec `faster-whisper`
3. Scoring de delivery (rythme, mots de remplissage, énergie, longueur de phrases)
4. Analyse du contenu et de la narration via LLM compatible OpenAI
5. *(Optionnel)* Analyse des frames vidéo avec OpenCV et MediaPipe
6. *(Optionnel)* Timeline d'assurance vocale avec un modèle Hugging Face
7. Génération de rapports JSON, Markdown et PDF

##### Modes de coaching disponibles

`investor` · `sales` · `demo_day` · `class_presentation` · `founder_story`

##### Lancement

```bash
cd Track3/pitch
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements_pitch_coach.txt

# Analyse complète
python agentic_pitch_coach.py --video ./my_pitch.mp4 --output ./output

# Run léger (sans modèles lourds)
python agentic_pitch_coach.py --video ./my_pitch.mp4 --whisper-size tiny --skip-visual --skip-voice-emotion
```

##### Serveur MCP

```bash
python mcp_pitch_coach_server.py
```

Outils MCP exposés : `pitch_coach_defaults`, `analyze_pitch_video`

---

## Frontend — Venture Path

**Répertoire :** `Template/`
**Stack :** React + Vite + Supabase

Landing page moderne pour la plateforme avec gestion des utilisateurs et des données.

### Fonctionnalités

- Page d'accueil SaaS responsive avec dark mode et micro-interactions
- Authentification Signup / Login via Supabase Auth
- Formulaire de contact et newsletter (stockage Supabase)
- Capture de sélection de plan tarifaire
- Témoignages avec soumission et modération
- Compteurs animés, accordéon FAQ, animations fluides
- Fallback local sécurisé si les clés Supabase ne sont pas configurées

### Lancement

```bash
cd Template
cp .env.example .env
# Ajouter les clés Supabase dans .env
npm install
npm run dev
```

### Configuration Supabase

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Traitement Multimodal

Le système accepte plusieurs types d'entrées.

### Entrées Supportées

- Descriptions textuelles
- Documents PDF
- Slides (PPTX)
- Tableurs financiers
- Enregistrements audio de pitch
- Images et captures d'écran

### Pipelines de Traitement

**Audio**
- Transcription speech-to-text (`faster-whisper`)
- Analyse de sentiment
- Détection de confiance vocale

**Documents**
- Extraction OCR (`pytesseract`)
- Parsing de mise en page
- Extraction de données financières (PDF, DOCX, PPTX)

**Slides & Images**
- Détection de structure visuelle
- Analyse de graphiques
- Embeddings image-texte

Toutes les informations extraites sont converties en blocs sémantiques structurés utilisés par le système d'agents.

---

## Système Mémoire Startup_State

La plateforme maintient un **système de mémoire augmenté par le contexte** combinant trois couches de stockage.

### Mémoire Graphe

Stocke les relations entre entités :
- fondateurs
- startups
- marchés
- concurrents
- investisseurs

Utilisée pour le raisonnement sur l'écosystème.

### Mémoire Vectorielle

Stocke les embeddings sémantiques de :
- affirmations de marché
- hypothèses financières
- déclarations juridiques
- interactions investisseurs

Utilisée pour la récupération contextuelle.

### État Structuré (startup_state.json)

Stocke les métriques système :
- scores de faisabilité
- probabilité de survie
- statut juridique
- avancement des milestones
- flags de risque

Chaque mise à jour de mémoire inclut des timestamps et scores de confiance pour maintenir la cohérence.

---

## Structure du Dépôt

```
dep/
│
├── Track1/                          # Track A — Idée & Faisabilité
│   ├── app.py                       # Interface Streamlit
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
├── Track2/                          # Track B — Juridique & Administratif
│   ├── app/
│   │   ├── agents/                  # Agents IA
│   │   │   ├── strategic_legal_agent.py
│   │   │   ├── intelligent_document_agent.py
│   │   │   └── ...
│   │   ├── api/                     # FastAPI endpoints
│   │   ├── core/                    # Config et paramètres
│   │   ├── mcp/                     # Serveur MCP local
│   │   ├── models/                  # Modèles de données
│   │   ├── run/                     # Runners CLI
│   │   ├── services/                # Orchestrateur, OCR, LLM client
│   │   └── utils/
│   ├── data/                        # Base de connaissances (kb_master.json)
│   ├── sample_data/
│   ├── requirements.txt
│   └── request_strict.json
│
├── Track3/                          # Track C — Exécution & Automatisation
│   ├── ExecutionAgent/
│   │   ├── execution_agent_with_mcp.py   # Agent principal
│   │   ├── mcp_startup_server.py         # Serveur MCP + Jira
│   │   ├── mcp_client_adapter.py
│   │   ├── a2a_protocol.py               # Bus A2A local
│   │   ├── a2a_agents.py                 # Planner, Critic, Action, Report
│   │   ├── pdf_report_generator.py
│   │   ├── startup_state.json
│   │   ├── structured_kb_sections/       # Base de connaissances locale
│   │   └── execution_agent_outputs/
│   │
│   └── pitch/
│       ├── agentic_pitch_coach.py        # Coach pitch principal
│       ├── mcp_pitch_coach_server.py     # Serveur MCP pitch
│       ├── requirements_pitch_coach.txt
│       └── output/
│
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
└── StorageSystem/                   # Système de stockage partagé (WIP)
```

---

## Stack Technologique

### Frontend

| Technologie | Usage |
|---|---|
| React + Vite | Interface utilisateur Venture Path |
| Supabase | Auth, base de données, storage |
| CSS (vanilla) | Styles, dark mode, animations |

### Backend & Agents

| Technologie | Usage |
|---|---|
| Python | Agents IA, pipelines, API |
| FastAPI | API REST Track B |
| Streamlit | Interface Track A |
| A2A Protocol | Bus de communication inter-agents |
| MCP (Model Context Protocol) | Pont agents ↔ outils externes |
| Jira REST API | Synchronisation de tâches |

### IA & Data

| Technologie | Usage |
|---|---|
| OpenAI-compatible LLM | Raisonnement et génération (Ollama, vLLM) |
| faster-whisper | Transcription audio |
| Sentence Transformers | Embeddings sémantiques |
| Cross Encoder | Reranking de récupération |
| MediaPipe + OpenCV | Analyse visuelle de pitch |
| pytesseract | OCR documents |
| NetworkX | Graphe de dépendances |
| ReportLab | Génération PDF |

### Infrastructure

| Technologie | Usage |
|---|---|
| Docker | Containerisation des services |
| Kubernetes | Orchestration |
| CI/CD pipelines | Intégration continue |

---

## Installation

### Prérequis

- Python 3.10+
- Node.js 18+
- Git

### Cloner le dépôt

```bash
git clone https://github.com/your-org/startup-ai-os.git
cd startup-ai-os
```

### OCR (Track B — Windows)

Installer Tesseract OCR binaire, puis vérifier :

```bash
tesseract --version
```

Si Tesseract n'est pas disponible, le système bascule automatiquement sur un fallback léger.

---

## Lancement du Système

Chaque track est indépendant et peut être lancé séparément.

### Track A (Faisabilité)

```bash
cd Track1
pip install -r requirements.txt
streamlit run app.py
```

### Track B (Juridique)

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

### Frontend Venture Path

```bash
cd Template
npm install
npm run dev
```

---

## Workflow de Développement

Le projet suit un workflow Git structuré.

### Branches

```
main          — branche stable
dev           — branche de développement
feature/*     — nouvelles fonctionnalités
```

### Exemples de branches feature

```
feature/market-intelligence-agent
feature/investor-matching
feature/pitch-analysis
```

Toutes les nouvelles fonctionnalités doivent être mergées via **Pull Requests**.

---

## Workflow Exemple

1. Le fondateur upload son idée et son pitch via Venture Path.
2. Le pipeline multimodal extrait la connaissance structurée.
3. Les agents Track A évaluent la viabilité business.
4. Les agents Track B génèrent le roadmap réglementaire.
5. L'Execution Agent (Track C) crée le planning opérationnel et synchronise avec Jira.
6. Le Pitch Coach (Track C) analyse la présentation et génère un coaching détaillé.
7. Le système génère des insights startup complets.

---

## Déploiement

La plateforme est conçue pour un **déploiement cloud en services containerisés**.

Architecture de déploiement recommandée :

- Conteneurs Docker par service
- Orchestration Kubernetes
- Instances GPU pour les workloads IA (Whisper, Sentence Transformers)
- Autoscaling des services backend
- Variables d'environnement séparées par environnement (dev / staging / prod)

> ⚠️ **Sécurité** : Ne jamais committer les fichiers `.env`, tokens Jira, clés API LLM ou fichiers de runtime contenant des données sensibles dans un dépôt public.

---

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
