import json
import subprocess
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent
USER_INPUT_PATH = BASE_DIR / "user_input.json"
REPORT_PATH = BASE_DIR / "outputs" / "final_master_report.json"
PIPELINE_PATH = BASE_DIR / "run_pipeline.py"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/track1/analyze")
def analyze_startup(payload: dict):
    USER_INPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    subprocess.run(
        [sys.executable, str(PIPELINE_PATH)],
        check=True,
        cwd=BASE_DIR,
    )

    if not REPORT_PATH.exists():
        return {"error": "final_master_report.json was not found."}

    return json.loads(REPORT_PATH.read_text(encoding="utf-8"))

@app.get("/track1/report")
def get_saved_report():
    if not REPORT_PATH.exists():
        return {"error": "No saved report found yet."}

    return json.loads(REPORT_PATH.read_text(encoding="utf-8"))