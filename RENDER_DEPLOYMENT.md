# Render free deployment

The repository now includes a Render Blueprint:

```text
render.yaml
```

Use this file from Render Dashboard > New > Blueprint to create the public frontend URL, Track1 API, and Postgres database together.

## Services to create

Create these in Render:

1. `startup-companies` as a free Render Postgres database.
2. `startup-track1-api` as a free Python Web Service, root directory `Track1`.
3. `startup-frontend` as a free Static Site, root directory `Template`.

## Track1 API settings

Build command:

```bash
pip install -r requirements-render.txt
```

Start command:

```bash
python start_render.py
```

Health check path:

```text
/health
```

Environment variables:

```text
DATABASE_URL=<Render internal database URL>
DB_SSLMODE=require
MODEL_MODE=hybrid
LLM_BASE_URL=https://tokenfactory.esprit.tn/api
LLM_API_KEY=<regenerated key>
LLM_MODEL=hosted_vllm/Llama-3.1-70B-Instruct
LLM_PLANNER_MODEL=hosted_vllm/Llama-3.1-70B-Instruct
LLM_REPORT_MODEL=hosted_vllm/Llama-3.1-70B-Instruct
LLM_VERIFY_SSL=false
EMBED_MODEL=nomic-embed-text-v2-moe
EMBED_BASE_URL=https://tokenfactory.esprit.tn/api
EMBED_API_KEY=<regenerated key, if embeddings are supported by your provider>
EMBED_VERIFY_SSL=false
CORS_ORIGINS=https://startup-frontend.onrender.com
```

If your LLM provider does not expose an embeddings endpoint compatible with OpenAI, the vector search in `companies.embedding` will not work on Render free because there is no local Ollama server there.

## Frontend settings

Build command:

```bash
npm ci && npm run build
```

Publish directory:

```text
dist
```

Environment variables:

```text
VITE_TRACK1_API_URL=https://startup-track1-api.onrender.com
```

## Database import

After the Render Postgres database is created, import the dump from your machine using the external database URL from Render:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "<EXTERNAL_DATABASE_URL>" -c "CREATE EXTENSION IF NOT EXISTS vector;"
& "C:\Program Files\PostgreSQL\18\bin\pg_restore.exe" --no-owner --no-privileges --dbname "<EXTERNAL_DATABASE_URL>" "C:\Users\maram\Downloads\startup_companies.dump"
```
