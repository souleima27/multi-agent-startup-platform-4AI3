# Render Deployment Guide

## Services

This project is prepared for two Render services:

- `startup-platform-api`: Docker web service for FastAPI, Track 1, Track 2, Track C/Jira, and shared agent runtime.
- `startup-platform-frontend`: static Vite/React site.

The backend entry point is `deploy.render_app:app`.

## Render Environment Variables

Add these to the backend service:

```env
APP_ENV=production
CORS_ALLOW_ORIGINS=https://startup-platform-frontend.onrender.com
A2A_LOCAL_FALLBACK=true

JIRA_SYNC_ENABLED=true
JIRA_BASE_URL=https://esprit-team-r6neq63b.atlassian.net
JIRA_USER_EMAIL=farah.hassen@esprit.tn
JIRA_API_TOKEN=YOUR_TOKEN
JIRA_PROJECT_KEY=KAN
JIRA_ISSUE_TYPE=Task
JIRA_VERIFY_SSL=true

MODEL_MODE=hybrid
LLM_API_KEY=YOUR_API_KEY
LLM_BASE_URL=https://tokenfactory.esprit.tn/api
LLM_PLANNER_MODEL=hosted_vllm/Llama-3.1-70B-Instruct
LLM_CRITIC_MODEL=hosted_vllm/Llama-3.1-70B-Instruct
LLM_VERIFY_SSL=false
```

Add this to the frontend static site:

```env
VITE_API_BASE_URL=https://startup-platform-api.onrender.com
VITE_SUPABASE_URL=YOUR_SUPABASE_URL_OPTIONAL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_OPTIONAL
```

If Render gives different service URLs, update `CORS_ALLOW_ORIGINS` and `VITE_API_BASE_URL` to match the actual URLs.

## Deployment Steps

1. Push this repository to GitHub.
2. In Render, create a new Blueprint from the repository and select `render.yaml`.
3. Set secret values for `LLM_API_KEY` and `JIRA_API_TOKEN`.
4. Deploy `startup-platform-api` first and confirm `/health` returns `{"status":"ok"}`.
5. Deploy `startup-platform-frontend`.
6. Open the frontend URL and test Track 1 analysis.
7. Test Track 2 backend health at `/track2/health`.
8. Run Track C/Jira only after confirming the Jira token has project permissions.

## Production Notes

- The frontend no longer hard-codes local API URLs. It uses `VITE_API_BASE_URL`.
- Track 1 CORS and Track 2 CORS are controlled by `CORS_ALLOW_ORIGINS`.
- Track 1 A2A calls fall back to in-process agent execution with `A2A_LOCAL_FALLBACK=true`, which is required on a single Render web service.
- Track 2 can use hosted OpenAI-compatible inference in `MODEL_MODE=hybrid`; it only falls back to Ollama-compatible generation if configured and reachable.
- Jira SSL verification remains enabled with `JIRA_VERIFY_SSL=true`.
- The LLM endpoint uses `LLM_VERIFY_SSL=false` because the supplied Track C configuration requires it.

## Final Checklist

- Backend deploys successfully.
- Frontend deploys successfully.
- `VITE_API_BASE_URL` points to the backend service URL.
- `CORS_ALLOW_ORIGINS` includes the frontend service URL.
- `LLM_API_KEY` is set as a Render secret.
- `JIRA_API_TOKEN` is set as a Render secret.
- `/health`, `/track1/health`, and `/track2/health` respond successfully.
- Track 1 analysis returns a final report.
- Track 2 `/track2/run-case` works with a sample payload.
- Jira sync creates or updates issues in project `KAN`.
