# Track B — Legal & Administrative PRO

Application Python pour l'automatisation du dossier juridique et administratif d'une startup tunisienne.

Le projet est actuellement structuré autour de 2 agents intelligents:
- A1 Strategic Legal Agent
- A2 Intelligent Document Agent

## Ce que fait le projet

- recommande une forme juridique adaptée au profil startup
- évalue l'éligibilité Startup Act et la probabilité de Startup Label
- vérifie les documents juridiques et administratifs
- accepte plusieurs formats de documents: images, PDF, DOCX, PPTX
- détecte les blocages documentaires et les actions de correction prioritaires
- produit un diagnostic détaillé document par document
- génère un rapport JSON et un rapport PDF exploitables pour un comité ou un client
- utilise une base de connaissances métier chargée depuis `data/dataset/kb_master.json`
- orchestre les agents via un bus A2A interne

## Architecture

### A1 Strategic Legal Agent

Cet agent analyse le profil de la startup:
- secteur
- nombre de fondateurs
- besoin de financement
- présence d'investisseurs
- besoin de responsabilité limitée
- caractère innovant et scalable

Il retourne:
- la forme juridique recommandée
- le score Startup Act
- la probabilité de Startup Label
- un checklist administratif ordonné
- des actions stratégiques

### A2 Intelligent Document Agent

Cet agent analyse chaque document individuellement.

Il fournit:
- type documentaire détecté
- format source détecté
- score de complétude
- problèmes trouvés
- diagnostic détaillé
- causes probables
- impact métier ou juridique
- actions correctives recommandées
- statut strict `GO/NO_GO` selon les règles activées

### Base de connaissances

La base de connaissances est chargée depuis:

`data/dataset/kb_master.json`

Elle sert à renforcer le raisonnement métier, notamment pour:
- les types de documents attendus
- les éléments de conformité
- le contexte Startup Label et administratif

### Orchestration

L'orchestrateur est dans `app/services/orchestrator.py`.
Il exécute les deux agents, agrège leurs résultats et produit la sortie finale.

Le bus A2A est utilisé dans `app/services/a2a.py` pour faire communiquer l'orchestrateur avec les agents.

## Formats de fichiers supportés

Le système accepte:
- images: `.png`, `.jpg`, `.jpeg`, `.bmp`, `.tif`, `.tiff`, `.webp`
- PDF: `.pdf`
- Word: `.docx`
- PowerPoint: `.pptx`

## OCR (extraction texte image)

Le projet utilise un OCR reel pour les documents image via `pytesseract`.

### Prerequis Windows

Installer Tesseract OCR (binaire systeme), puis verifier:

```bash
tesseract --version
```

Si Tesseract n'est pas disponible, le systeme bascule automatiquement sur une extraction legere (fallback) pour ne pas bloquer l'execution.

## Important

Le système n'est pas conçu comme un chat libre où l'utilisateur pose n'importe quelle question.
Le flux principal est volontairement contrôlé: l'utilisateur envoie un dossier documentaire et le système renvoie un diagnostic, des corrections et une décision.

## Installation

### 1. Créer l'environnement virtuel

```bash
python -m venv .venv
```

### 2. Activer l'environnement sur Windows

```bash
.venv\Scripts\activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

## Exécution

### Lancer l'API FastAPI

```bash
uvicorn app.api.main:app --reload
```

API disponible ensuite sur:
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/track-b/run`
- `http://127.0.0.1:8000/run-case`

### Lancer le runner local

Le runner lit un fichier JSON de requête.

```bash
python -m app.run.run_agent2 request_strict.json
```

Si tu es déjà dans le dossier du projet, la même commande fonctionne aussi avec l'interpréteur du venv:

```bash
.venv\Scripts\python.exe -m app.run.run_agent2 request_strict.json
```

### Generer des faux documents realistes (tests)

Cette commande cree automatiquement un pack legal fictif:
- statuts
- rc
- if
- attestation bancaire
- cin

Sorties generees:
- `data/synthetic_docs/pdf/*.pdf`
- `data/synthetic_docs/scans/*.png`
- `data/synthetic_docs/pitch_deck/*.pdf`
- `data/synthetic_docs/pitch_deck/*.txt`
- `request_synthetic.json`

Commande:

```bash
python -m app.run.generate_fake_documents
```

Puis lancer l'analyse sur ce jeu de test:

```bash
python -m app.run.run_agent2 request_synthetic.json
```

### Runner de cas structure

Commande compatible ajoutee:

```bash
python -m app.run.run_case sample_data/request_demo.json
```

Le dossier `sample_data/` contient un payload de demonstration et une structure de documents.

### Lancer le serveur MCP local

```bash
python -m app.mcp.server
```

Ce serveur est un adaptateur stdio JSON simple pour la démonstration locale.

## Exemple de requête

Le fichier `request_strict.json` sert d'exemple de payload.

Structure principale:
- `startup_profile`: profil de la startup
- `documents`: liste des documents avec leurs chemins
- `options`: mode strict, rapports JSON/PDF, préfixe de rapport

Exemple minimal:

```json
{
	"startup_profile": {
		"startup_name": "Neuronix Legal AI",
		"sector": "AI SaaS",
		"activity_description": "AI platform for startup legal guidance and compliance automation.",
		"founders_count": 3,
		"funding_need_tnd": 250000,
		"wants_investors": true,
		"needs_limited_liability": true,
		"has_foreign_investors": false,
		"innovative": true,
		"scalable": true,
		"uses_technology": true
	},
	"documents": [
		{
			"path": "C:\\Users\\maram\\Desktop\\track_b_legal_admin_pro\\data\\dataset\\images\\doc_0.png",
			"declared_type": "statuts"
		}
	],
	"options": {
		"strict_mode": true,
		"generate_json_report": true,
		"generate_pdf_report": true,
		"report_prefix": "committee_packet"
	}
}
```

## Sortie générée

Le système retourne:
- `strategic_agent`: résultat de l'agent stratégique
- `document_agent`: diagnostic détaillé des documents
- `final_output`: résumé décisionnel

Dans `final_output`, tu trouveras notamment:
- la forme juridique recommandée
- le score de complétude documentaire
- le score Startup Act
- le statut signature/cachet par document
- les deadlines et dependances administratives
- le mode strict
- les violations strictes
- la décision `GO` ou `NO_GO`
- la décision finale `PASS` / `WARNING` / `FAIL`
- les chemins des rapports JSON et PDF

## MCP Context Manager

Le contexte partage est gere par `app/services/mcp_context.py` et expose dans `final_output.mcp_context`.

Clés principales:
- `startup_info`
- `sector`
- `recommended_legal_form`
- `founders_structure`
- `funding_needs`
- `startup_act_score`
- `uploaded_documents`
- `ocr_text`
- `document_validation_results`
- `missing_documents`
- `workflow_steps`
- `checklist`
- `final_report`

## A2A JSON Agent 1 -> Agent 2

L'orchestrateur construit un paquet A2A structure pour Agent 2:

```json
{
	"agent": "legal_classification_agent",
	"recommended_legal_form": "SUARL",
	"startup_act_score": 0.78,
	"required_documents": [
		"cin",
		"statuts",
		"attestation_bancaire",
		"declaration_beneficiaire_effectif"
	]
}
```

## Endpoints utiles

- `GET /health`
- `POST /track-b/run`
- `POST /agents/a1/strategic-assessment`
- `POST /agents/a2/document-intelligence`

## Reporting

Le projet peut générer deux livrables:
- un rapport JSON complet
- un rapport PDF lisible pour comité ou client

Les rapports sont écrits dans le dossier `reports/`.

## Configuration

Les paramètres sont définis dans `app/core/config.py` et peuvent être surchargés via `.env`.

Variables utiles:
- `LLM_BASE_URL`: URL du serveur local compatible Ollama
- `LLM_MODEL`: modèle utilisé, par défaut `deepseek-r1:7b`
- `LLM_TIMEOUT_SECONDS`: timeout des appels LLM

## Commande de test principale

```bash
python -m app.run.run_agent2 request_strict.json
```

## Commandes attendues

```bash
python -m app.run.run_agent2 request_synthetic.json
```

```bash
python -m app.run.run_case sample_data/request_demo.json
```

```bash
uvicorn app.api.main:app --reload
```

```bash
pytest
```

## Tests locaux

Tu peux aussi lancer les tests Python si ton environnement est prêt:

```bash
pytest
```

## MCP et A2A

Oui, j'ai travaillé avec les deux, mais pas de la même façon.

- A2A: oui, il est utilisé dans le pipeline principal pour orchestrer les agents.
- MCP: oui, mais sous forme d'un serveur local simple dans `app/mcp/server.py`.
- MCP officiel: non, ce n'est pas le SDK officiel MCP; c'est un adaptateur stdio JSON léger pour la démonstration et l'intégration locale.

## Notes de conception

- Le système privilégie un comportement déterministe et utile pour le dossier juridique.
- Les documents non-images sont traités via extraction de contenu quand c'est possible.
- Les documents image sont vérifiés visuellement pour la qualité, la signature et le cachet.
- Le mode strict bloque la sortie quand des règles critiques ne sont pas respectées.

## Fichiers clés

- `app/api/main.py`: API FastAPI
- `app/services/orchestrator.py`: orchestration des agents
- `app/services/mcp_context.py`: contexte partage (MCP context manager)
- `app/agents/strategic_legal_agent.py`: agent juridique stratégique
- `app/agents/intelligent_document_agent.py`: agent documentaire intelligent
- `app/services/document_parser.py`: extraction PDF/DOCX/PPTX
- `app/services/knowledge_base.py`: chargement et recherche dans la base de connaissances
- `app/services/local_llm.py`: client LLM local
- `app/mcp/server.py`: serveur local stdio JSON
- `app/run/run_agent2.py`: runner CLI local
- `app/run/run_case.py`: runner CLI de cas structure
