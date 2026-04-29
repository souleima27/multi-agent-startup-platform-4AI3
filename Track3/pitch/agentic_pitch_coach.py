#!/usr/bin/env python3
"""
Agentic Local Python 3.10 Pitch Coach Agent — completed version

Main changes in this version:
- analyze_content uses an LLM, not keyword/sentence-similarity matching.
- analyze_narrative uses an LLM, not keyword/zero-shot heuristics as the main analyzer.
- The evidence loop no longer stops after only transcript + audio + content + narrative.
- The agent requires all enabled analyses before writing the report:
  extract_audio -> transcribe_audio -> analyze_audio -> analyze_delivery
  -> analyze_content -> analyze_narrative
  -> sample_frames -> analyze_visuals -> analyze_presence -> analyze_visual_assurance
  -> analyze_voice_assurance -> generate_rewrite -> report stages
- Python still enforces valid tools, prerequisites, skip flags, max steps, and safe execution.

Example:
  python agentic_pitch_coach_completed.py --video ./my_pitch.mp4 --output ./pitch_coach_output

Skip expensive modalities:
  python agentic_pitch_coach_completed.py --video ./my_pitch.mp4 --skip-visual --skip-voice-emotion

OpenAI-compatible API settings:
  export OPENAI_API_KEY="your_key"
  export OPENAI_BASE_URL="https://tokenfactory.esprit.tn/api"
  export OPENAI_MODEL="hosted_vllm/Llama-3.1-70B-Instruct"

Install typical dependencies:
  pip install numpy opencv-python imageio-ffmpeg librosa mediapipe faster-whisper openai \
              transformers torch reportlab

Notes:
- reportlab is optional. If unavailable, the script writes Markdown/JSON only.
- Voice assurance analysis can be slow; use --skip-voice-emotion if needed.
- Visual analysis can be slow; use --skip-visual if needed.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import subprocess
import time
import importlib
from dataclasses import dataclass, asdict, field
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    import numpy as np
except Exception:
    np = None

try:
    import cv2
except Exception:
    cv2 = None

try:
    import imageio_ffmpeg
except Exception:
    imageio_ffmpeg = None

try:
    import librosa
except Exception:
    librosa = None

try:
    import mediapipe as mp
except Exception:
    mp = None

try:
    import torch
    import torch.nn.functional as F
except Exception:
    torch = None
    F = None

try:
    from faster_whisper import WhisperModel
except Exception:
    WhisperModel = None

try:
    from openai import OpenAI
except Exception:
    OpenAI = None

try:
    from transformers import AutoFeatureExtractor, AutoModelForAudioClassification
except Exception:
    AutoFeatureExtractor = None
    AutoModelForAudioClassification = None

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
except Exception:
    A4 = None
    getSampleStyleSheet = None
    SimpleDocTemplate = None
    Paragraph = None
    Spacer = None


# =========================================================
# 1) DEFAULT CONFIG
# =========================================================
DEFAULT_OPENAI_BASE_URL = "https://tokenfactory.esprit.tn/api"
DEFAULT_OPENAI_MODEL = "hosted_vllm/Llama-3.1-70B-Instruct"
DEFAULT_VOICE_EMOTION_MODEL = "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
DEFAULT_WHISPER_SIZE = "medium"
DEFAULT_FRAME_EVERY_SEC = 1.0
DEFAULT_CONF_SEGMENT_SEC = 5.0
USE_CUDA = bool(torch and torch.cuda.is_available())


# =========================================================
# 2) UTILS
# =========================================================
def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def save_json(obj: Any, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)


def clean_text(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip()


def split_sentences(text: str) -> List[str]:
    text = clean_text(text)
    parts = re.split(r"(?<=[.!?])\s+", text)
    return [p.strip() for p in parts if p.strip()]


def unique_keep_order(seq: List[str]) -> List[str]:
    seen = set()
    out = []
    for x in seq:
        x = clean_text(str(x))
        if x and x not in seen:
            seen.add(x)
            out.append(x)
    return out


def clamp_score(x: float) -> int:
    return max(0, min(100, int(round(float(x)))))


def contains_metrics(text: str) -> bool:
    t = text.lower()
    patterns = [
        r"\b\d+\b",
        r"\$\s?\d",
        r"\b\d+(\.\d+)?\s*%",
        r"\bmillion\b",
        r"\bthousand\b",
        r"\bcustomers\b",
        r"\bretention\b",
        r"\bcac\b",
        r"\brevenue\b",
        r"\border(s)?\b",
        r"\bgrowth\b",
        r"\bpayback\b",
        r"\busers\b",
        r"\bpilot\b",
    ]
    return any(re.search(p, t) for p in patterns)


def safe_json_extract(text: str) -> Optional[dict]:
    text = (text or "").strip()
    try:
        return json.loads(text)
    except Exception:
        pass

    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass

    m = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if m:
        try:
            return json.loads(m.group(0))
        except Exception:
            pass
    return None


def seconds_to_mmss(sec: float) -> str:
    m = int(sec // 60)
    s = int(sec % 60)
    return f"{m:02d}:{s:02d}"


def ensure_file_exists(path: str | Path, label: str = "file") -> Path:
    p = Path(path).expanduser().resolve()
    if not p.exists():
        raise FileNotFoundError(f"{label} not found: {p}")
    return p


def summarize_result(result: Any, max_chars: int = 1200) -> str:
    try:
        compact = json.dumps(result, ensure_ascii=False) if isinstance(result, dict) else str(result)
    except Exception:
        compact = repr(result)
    compact = clean_text(compact)
    return compact[:max_chars] + ("..." if len(compact) > max_chars else "")


def replace_psychological_language(text: str) -> str:
    cleaned = clean_text(text)
    replacements = [
        (r"\byou are nervous\b", "presentation assurance cues appear weaker"),
        (r"\byou seem nervous\b", "presentation assurance cues appear weaker"),
        (r"\byou lack confidence\b", "presentation assurance cues appear weaker"),
        (r"\byou are insecure\b", "presentation assurance cues appear weaker"),
        (r"\byou seem insecure\b", "presentation assurance cues appear weaker"),
        (r"\byour confidence is low\b", "presentation assurance cues appear weaker"),
        (r"\blow confidence\b", "weaker presentation assurance cues"),
    ]
    for pattern, replacement in replacements:
        cleaned = re.sub(pattern, replacement, cleaned, flags=re.IGNORECASE)
    return cleaned


def sanitize_language(obj: Any) -> Any:
    if isinstance(obj, str):
        return replace_psychological_language(obj)
    if isinstance(obj, list):
        return [sanitize_language(x) for x in obj]
    if isinstance(obj, dict):
        return {k: sanitize_language(v) for k, v in obj.items()}
    return obj


def resolve_mediapipe_solutions() -> Any:
    if mp is None:
        raise RuntimeError("mediapipe is not installed.")

    solutions = getattr(mp, "solutions", None)
    if solutions is not None:
        return solutions

    fallback_modules = ["mediapipe.python.solutions"]
    last_error = None
    for module_name in fallback_modules:
        try:
            module = importlib.import_module(module_name)
            if hasattr(module, "face_detection") and hasattr(module, "pose"):
                return module
        except Exception as exc:
            last_error = exc

    raise RuntimeError(
        "MediaPipe visual solutions API was not found in this installation."
        + (f" Last import error: {last_error}" if last_error else "")
    )


def empty_visual_features() -> Dict[str, Any]:
    return {
        "sampled_frames": 0,
        "face_detected_ratio": 0.0,
        "pose_detected_ratio": 0.0,
        "avg_face_area": 0.0,
        "nose_x_std": 0.0,
        "nose_y_std": 0.0,
        "avg_shoulder_width": 0.0,
        "frames": [],
    }


# =========================================================
# 3) CONFIG AND STATE
# =========================================================
@dataclass
class PitchCoachConfig:
    video_path: str
    output_dir: str = "pitch_coach_output"
    openai_base_url: str = DEFAULT_OPENAI_BASE_URL
    openai_model: str = DEFAULT_OPENAI_MODEL
    openai_api_key: Optional[str] = None
    whisper_size: str = DEFAULT_WHISPER_SIZE
    frame_every_sec: float = DEFAULT_FRAME_EVERY_SEC
    confidence_segment_sec: float = DEFAULT_CONF_SEGMENT_SEC
    voice_emotion_model: str = DEFAULT_VOICE_EMOTION_MODEL
    skip_voice_emotion: bool = False
    skip_visual: bool = False
    disable_llm: bool = False
    max_frames: Optional[int] = None
    max_agent_steps: int = 20
    judge_revision_rounds: int = 2
    coaching_mode: str = "investor"

    @property
    def root(self) -> Path:
        return Path(self.output_dir).expanduser().resolve()

    @property
    def audio_dir(self) -> Path:
        return self.root / "audio"

    @property
    def frames_dir(self) -> Path:
        return self.root / "frames"

    @property
    def report_dir(self) -> Path:
        return self.root / "reports"

    def prepare_dirs(self) -> None:
        for d in [self.audio_dir, self.frames_dir, self.report_dir]:
            d.mkdir(parents=True, exist_ok=True)


@dataclass
class AgentState:
    video_path: str
    output_dir: str
    goal: str
    coaching_mode: str
    observations: Dict[str, Any] = field(default_factory=dict)
    analyses: Dict[str, Any] = field(default_factory=dict)
    decisions: List[Dict[str, Any]] = field(default_factory=list)
    tool_results: List[Dict[str, Any]] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    completed_tools: List[str] = field(default_factory=list)
    step_count: int = 0
    max_steps: int = 20

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        obs = d.get("observations", {})
        analyses = d.get("analyses", {})

        if "frame_paths" in obs:
            obs["frame_paths"] = f"{len(self.observations.get('frame_paths', []))} sampled frame paths"

        if "transcript" in obs:
            obs["transcript"] = self.observations.get("transcript", "")[:5000]

        if "transcript_data" in obs:
            td = self.observations.get("transcript_data", {})
            obs["transcript_data"] = {
                "language": td.get("language"),
                "duration_sec": td.get("duration_sec"),
                "segment_count": len(td.get("segments", [])),
                "text_preview": td.get("text", "")[:1200],
            }

        if "visual_features" in analyses:
            vf = self.analyses.get("visual_features", {})
            analyses["visual_features"] = {
                "sampled_frames": vf.get("sampled_frames", 0),
                "face_detected_ratio": vf.get("face_detected_ratio", 0),
                "pose_detected_ratio": vf.get("pose_detected_ratio", 0),
                "avg_face_area": vf.get("avg_face_area", 0),
                "nose_x_std": vf.get("nose_x_std", 0),
                "nose_y_std": vf.get("nose_y_std", 0),
                "frame_record_count": len(vf.get("frames", [])),
            }

        if "visual_assurance" in analyses:
            va = self.analyses.get("visual_assurance", {})
            analyses["visual_assurance"] = {
                "global_visual_assurance_score": va.get("global_visual_assurance_score", 0),
                "lowest_visual_assurance_segments": va.get("lowest_visual_assurance_segments", []),
                "timeline_count": len(va.get("visual_assurance_timeline", [])),
            }

        if "voice_assurance" in analyses:
            vo = self.analyses.get("voice_assurance", {})
            analyses["voice_assurance"] = {
                "global_voice_assurance_score": vo.get("global_voice_assurance_score", 0),
                "lowest_voice_assurance_segments": vo.get("lowest_voice_assurance_segments", []),
                "timeline_count": len(vo.get("voice_assurance_timeline", [])),
                "skipped": vo.get("skipped", False),
            }

        return d

    def add_tool_result(self, tool_name: str, result: Any, reason: str):
        if tool_name not in self.completed_tools:
            self.completed_tools.append(tool_name)
        self.tool_results.append(
            {
                "tool": tool_name,
                "reason": reason,
                "result_summary": summarize_result(result),
            }
        )


# =========================================================
# 4) RUNTIME VALIDATION
# =========================================================
def validate_runtime_requirements(config: PitchCoachConfig) -> None:
    missing = []
    if np is None:
        missing.append("numpy")
    if imageio_ffmpeg is None:
        missing.append("imageio-ffmpeg")
    if WhisperModel is None:
        missing.append("faster-whisper")
    if librosa is None:
        missing.append("librosa")
    if not config.skip_visual and cv2 is None:
        missing.append("opencv-python")
    if not config.skip_visual and mp is None:
        missing.append("mediapipe")
    if not config.disable_llm and OpenAI is None:
        missing.append("openai")

    if missing:
        raise RuntimeError(
            "Missing required dependencies for this run: "
            + ", ".join(unique_keep_order(missing))
            + ". Install requirements first or use skip flags."
        )


# =========================================================
# 5) LLM CLIENT
# =========================================================
class LLMClient:
    def __init__(self, config: PitchCoachConfig):
        if OpenAI is None:
            raise RuntimeError("Missing dependency: openai is required for LLM-backed agentic control.")
        api_key = config.openai_api_key or os.getenv("OPENAI_API_KEY") or "EMPTY"
        base_url = config.openai_base_url or os.getenv("OPENAI_BASE_URL") or DEFAULT_OPENAI_BASE_URL
        model = config.openai_model or os.getenv("OPENAI_MODEL") or DEFAULT_OPENAI_MODEL
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model

    def generate(self, prompt: str, max_tokens: int = 900, temperature: float = 0.2) -> str:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an agentic pitch coach controller and report writer. "
                    "You must follow JSON schemas exactly when requested. "
                    "You must not invent facts. Use careful language for confidence/presence cues."
                ),
            },
            {"role": "user", "content": prompt},
        ]
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content.strip()


def llm_json(
    llm: LLMClient,
    prompt: str,
    max_tokens: int = 900,
    temperature: float = 0.1,
    fallback: Optional[dict] = None,
) -> dict:
    raw = llm.generate(prompt, max_tokens=max_tokens, temperature=temperature)
    parsed = safe_json_extract(raw)
    if parsed is None:
        if fallback is not None:
            fallback = dict(fallback)
            fallback["_raw_invalid_json"] = raw[:2000]
            return sanitize_language(fallback)
        raise ValueError(f"LLM returned invalid JSON: {raw[:1000]}")
    return sanitize_language(parsed)


# =========================================================
# 6) OBSERVE TOOLS
# =========================================================
class AudioExtractor:
    def __init__(self, audio_dir: Path):
        if imageio_ffmpeg is None:
            raise RuntimeError("Missing dependency: imageio-ffmpeg is required for audio extraction.")
        self.audio_dir = audio_dir
        self.ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    def run(self, video_path: Path) -> str:
        audio_path = self.audio_dir / f"{video_path.stem}.wav"
        cmd = [self.ffmpeg, "-y", "-i", str(video_path), "-ac", "1", "-ar", "16000", "-vn", str(audio_path)]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"FFmpeg failed:\n{result.stderr[:4000]}")
        return str(audio_path)


class Transcriber:
    def __init__(self, model_size: str = "small"):
        if WhisperModel is None:
            raise RuntimeError("Missing dependency: faster-whisper is required for transcription.")
        device = "cuda" if USE_CUDA else "cpu"
        compute_type = "float16" if USE_CUDA else "int8"
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)

    def run(self, audio_path: str) -> Dict[str, Any]:
        segments, info = self.model.transcribe(audio_path, beam_size=4, vad_filter=True)
        segs = []
        full_text = []
        for s in segments:
            txt = clean_text(s.text)
            if txt:
                segs.append({"start": float(s.start), "end": float(s.end), "text": txt})
                full_text.append(txt)
        return {
            "language": getattr(info, "language", None),
            "duration_sec": getattr(info, "duration", None),
            "segments": segs,
            "text": " ".join(full_text),
        }


class AudioStats:
    def run(self, audio_path: str, transcript: str) -> Dict[str, Any]:
        if librosa is None:
            raise RuntimeError("Missing dependency: librosa is required for audio feature extraction.")
        y, sr = librosa.load(audio_path, sr=16000)
        duration = librosa.get_duration(y=y, sr=sr)
        rms = librosa.feature.rms(y=y)[0]
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        try:
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            tempo = float(np.asarray(tempo).reshape(-1)[0])
        except Exception:
            tempo = 0.0

        words = transcript.split()
        wpm = (len(words) / duration) * 60 if duration > 0 else 0.0
        fillers = ["uh", "um", "erm", "ah", "eh", "euh", "like", "you know", "kind of", "sort of"]
        lower = " " + transcript.lower() + " "
        filler_count = sum(lower.count(f" {f} ") for f in fillers)
        sents = split_sentences(transcript)
        avg_sentence_len = float(np.mean([len(s.split()) for s in sents])) if sents else 0.0

        return {
            "duration_sec": float(duration),
            "word_count": int(len(words)),
            "words_per_minute": float(wpm),
            "mean_energy": float(np.mean(rms)) if len(rms) else 0.0,
            "std_energy": float(np.std(rms)) if len(rms) else 0.0,
            "mean_zcr": float(np.mean(zcr)) if len(zcr) else 0.0,
            "tempo_estimate": tempo,
            "filler_count": int(filler_count),
            "avg_sentence_length_words": avg_sentence_len,
        }


class FrameSampler:
    def __init__(self, frames_dir: Path, every_sec: float = 1.0, max_frames: Optional[int] = None):
        if cv2 is None:
            raise RuntimeError("Missing dependency: opencv-python is required for frame sampling.")
        self.frames_dir = frames_dir
        self.every_sec = every_sec
        self.max_frames = max_frames

    def run(self, video_path: Path) -> List[str]:
        out_dir = self.frames_dir / video_path.stem
        out_dir.mkdir(parents=True, exist_ok=True)
        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise RuntimeError(f"Could not open video: {video_path}")
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        interval = max(1, int(round(fps * self.every_sec)))
        frame_idx = 0
        paths = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % interval == 0:
                ts = frame_idx / fps
                out_path = out_dir / f"frame_{frame_idx:08d}_{ts:.2f}s.jpg"
                cv2.imwrite(str(out_path), frame)
                paths.append(str(out_path))
                if self.max_frames is not None and len(paths) >= self.max_frames:
                    break
            frame_idx += 1
        cap.release()
        return paths


class VisualStats:
    def __init__(self):
        if cv2 is None:
            raise RuntimeError("Missing dependency: opencv-python is required for visual analysis.")
        if mp is None:
            raise RuntimeError("Missing dependency: mediapipe is required for visual analysis.")
        solutions = resolve_mediapipe_solutions()
        self.mp_face = solutions.face_detection
        self.mp_pose = solutions.pose

    def run(self, frame_paths: List[str]) -> Dict[str, Any]:
        face_count = 0
        pose_count = 0
        total = 0
        face_areas = []
        nose_x = []
        nose_y = []
        shoulder_widths = []
        frame_records = []

        with self.mp_face.FaceDetection(model_selection=1, min_detection_confidence=0.5) as face_det, self.mp_pose.Pose(
            static_image_mode=True, min_detection_confidence=0.5
        ) as pose_det:
            for fp in frame_paths:
                img = cv2.imread(fp)
                if img is None:
                    continue
                total += 1
                rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                ts_match = re.search(r"_(\d+\.\d+)s\.jpg$", fp)
                ts = float(ts_match.group(1)) if ts_match else None

                fr = face_det.process(rgb)
                face_detected = 0
                face_area = None
                if fr.detections:
                    face_detected = 1
                    face_count += 1
                    box = fr.detections[0].location_data.relative_bounding_box
                    face_area = max(0.0, float(box.width * box.height))
                    face_areas.append(face_area)

                pr = pose_det.process(rgb)
                pose_detected = 0
                nx, ny, sw = None, None, None
                if pr.pose_landmarks:
                    pose_detected = 1
                    pose_count += 1
                    lm = pr.pose_landmarks.landmark
                    nx = float(lm[0].x)
                    ny = float(lm[0].y)
                    ls, rs = lm[11], lm[12]
                    sw = math.sqrt((ls.x - rs.x) ** 2 + (ls.y - rs.y) ** 2)
                    nose_x.append(nx)
                    nose_y.append(ny)
                    shoulder_widths.append(sw)

                frame_records.append(
                    {
                        "timestamp": ts,
                        "frame_path": fp,
                        "face_detected": face_detected,
                        "pose_detected": pose_detected,
                        "face_area": face_area if face_area is not None else 0.0,
                        "nose_x": nx,
                        "nose_y": ny,
                        "shoulder_width": sw,
                    }
                )

        return {
            "sampled_frames": total,
            "face_detected_ratio": face_count / total if total else 0.0,
            "pose_detected_ratio": pose_count / total if total else 0.0,
            "avg_face_area": float(np.mean(face_areas)) if face_areas else 0.0,
            "nose_x_std": float(np.std(nose_x)) if nose_x else 0.0,
            "nose_y_std": float(np.std(nose_y)) if nose_y else 0.0,
            "avg_shoulder_width": float(np.mean(shoulder_widths)) if shoulder_widths else 0.0,
            "frames": frame_records,
        }


# =========================================================
# 7) ANALYSIS TOOLS
# =========================================================
class LLMContentAnalyzer:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def run(self, transcript: str) -> Dict[str, Any]:
        prompt = f"""
You are analyzing the content clarity of a startup pitch.

Analyze whether the transcript clearly covers these pitch components:
- problem
- target_customer
- solution
- value_proposition
- differentiation
- market
- business_model
- traction
- team
- ask
- closing

Rules:
- Use only the transcript.
- Do not invent facts.
- If a section is weak or missing, mark it missing or weak.
- Give a score from 0 to 100.
- Return strict JSON only.

Transcript:
{transcript[:7000]}

Return exactly:
{{
  "score": 0,
  "covered_parts": [],
  "missing_parts": [],
  "weak_parts": [],
  "has_metrics": false,
  "generic_phrase_count": 0,
  "component_feedback": {{
    "problem": "...",
    "target_customer": "...",
    "solution": "...",
    "value_proposition": "...",
    "differentiation": "...",
    "market": "...",
    "business_model": "...",
    "traction": "...",
    "team": "...",
    "ask": "...",
    "closing": "..."
  }},
  "evidence": [],
  "main_content_issue": "...",
  "recommended_fix": "..."
}}
"""
        fallback = {
            "score": 50,
            "covered_parts": [],
            "missing_parts": [],
            "weak_parts": [],
            "has_metrics": contains_metrics(transcript),
            "generic_phrase_count": 0,
            "component_feedback": {},
            "evidence": [],
            "main_content_issue": "LLM content analysis failed; fallback used.",
            "recommended_fix": "Clarify the problem, customer, solution, proof, and ask.",
        }
        result = llm_json(self.llm, prompt, max_tokens=1400, temperature=0.1, fallback=fallback)
        result["score"] = clamp_score(result.get("score", 50))
        result.setdefault("covered_parts", [])
        result.setdefault("missing_parts", [])
        result.setdefault("weak_parts", [])
        result.setdefault("has_metrics", contains_metrics(transcript))
        result.setdefault("generic_phrase_count", 0)
        result.setdefault("component_feedback", {})
        result.setdefault("evidence", [])
        result.setdefault("main_content_issue", "")
        result.setdefault("recommended_fix", "")
        result["similarity_scores"] = {}
        return sanitize_language(result)


class LLMNarrativeAnalyzer:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def run(self, transcript: str) -> Dict[str, Any]:
        prompt = f"""
You are analyzing the narrative structure of a startup pitch.

Evaluate:
- opening_hook
- problem_setup
- solution_flow
- proof_or_credibility
- memorability
- closing
- ask_clarity

Rules:
- Use only the transcript.
- Do not invent facts.
- Give a score from 0 to 100.
- Return strict JSON only.

Transcript:
{transcript[:7000]}

Return exactly:
{{
  "score": 0,
  "signals": {{
    "opening_hook_score": 0,
    "problem_clarity_score": 0,
    "solution_flow_score": 0,
    "proof_strength_score": 0,
    "closing_score": 0,
    "ask_clarity_score": 0,
    "memorability_score": 0
  }},
  "narrative_summary": "...",
  "strongest_narrative_point": "...",
  "weakest_narrative_point": "...",
  "key_gaps": [],
  "coaching_directions": [],
  "evidence": []
}}
"""
        fallback = {
            "score": 50,
            "signals": {
                "opening_hook_score": 50,
                "problem_clarity_score": 50,
                "solution_flow_score": 50,
                "proof_strength_score": 50,
                "closing_score": 50,
                "ask_clarity_score": 50,
                "memorability_score": 50,
            },
            "narrative_summary": "LLM narrative analysis failed; fallback used.",
            "strongest_narrative_point": "",
            "weakest_narrative_point": "",
            "key_gaps": [],
            "coaching_directions": [],
            "evidence": [],
        }
        result = llm_json(self.llm, prompt, max_tokens=1300, temperature=0.1, fallback=fallback)
        result["score"] = clamp_score(result.get("score", 50))
        result.setdefault("signals", {})
        result.setdefault("narrative_summary", "")
        result.setdefault("strongest_narrative_point", "")
        result.setdefault("weakest_narrative_point", "")
        result.setdefault("key_gaps", [])
        result.setdefault("coaching_directions", [])
        result.setdefault("evidence", [])

        result["signals"].setdefault("narrative_summary", result.get("narrative_summary", ""))
        result["signals"].setdefault("strongest_narrative_point", result.get("strongest_narrative_point", ""))
        result["signals"].setdefault("weakest_narrative_point", result.get("weakest_narrative_point", ""))
        result["signals"].setdefault("key_gaps", result.get("key_gaps", []))
        result["signals"].setdefault("coaching_directions", result.get("coaching_directions", []))
        return sanitize_language(result)


class DeliveryStats:
    def run(self, audio_features: Dict[str, Any]) -> Dict[str, Any]:
        wpm = audio_features.get("words_per_minute", 0)
        fillers = audio_features.get("filler_count", 0)
        energy = audio_features.get("mean_energy", 0)
        avg_sentence = audio_features.get("avg_sentence_length_words", 0)
        score = 60
        if 110 <= wpm <= 170:
            score += 15
        elif 90 <= wpm <= 190:
            score += 7
        else:
            score -= 8
        score -= min(18, fillers * 2)
        if energy > 0.02:
            score += 10
        if avg_sentence > 24:
            score -= 8
        return {
            "score": clamp_score(score),
            "observations": {
                "words_per_minute": round(wpm, 2),
                "filler_count": fillers,
                "mean_energy": round(energy, 5),
                "avg_sentence_length_words": round(avg_sentence, 2),
            },
        }


class PresenceStats:
    def run(self, visual_features: Dict[str, Any]) -> Dict[str, Any]:
        face_ratio = visual_features.get("face_detected_ratio", 0)
        pose_ratio = visual_features.get("pose_detected_ratio", 0)
        nose_x_std = visual_features.get("nose_x_std", 0)
        nose_y_std = visual_features.get("nose_y_std", 0)
        face_area = visual_features.get("avg_face_area", 0)
        score = 55
        score += 15 if face_ratio >= 0.7 else (-3 if face_ratio < 0.4 else 4)
        score += 10 if pose_ratio >= 0.5 else (-2 if pose_ratio < 0.25 else 3)
        score += 8 if (nose_x_std <= 0.08 and nose_y_std <= 0.08) else -6
        score += 3 if face_area >= 0.04 else -2
        return {
            "score": clamp_score(score),
            "observations": {
                "face_detected_ratio": round(face_ratio, 3),
                "pose_detected_ratio": round(pose_ratio, 3),
                "nose_x_std": round(nose_x_std, 3),
                "nose_y_std": round(nose_y_std, 3),
                "avg_face_area": round(face_area, 4),
            },
        }


class VisualAssuranceTimeline:
    def __init__(self, segment_sec: float = 5.0):
        self.segment_sec = segment_sec

    def run(self, visual_features: Dict[str, Any]) -> Dict[str, Any]:
        frames = visual_features.get("frames", [])
        frames = [f for f in frames if f.get("timestamp") is not None]
        if not frames:
            return {
                "global_visual_assurance_score": 0,
                "visual_assurance_timeline": [],
                "lowest_visual_assurance_segments": [],
            }
        frames = sorted(frames, key=lambda x: x["timestamp"])
        max_time = frames[-1]["timestamp"]
        timeline = []
        start = 0.0
        while start <= max_time:
            end = start + self.segment_sec
            seg = [f for f in frames if start <= f["timestamp"] < end]
            if not seg:
                start = end
                continue
            face_vis = float(np.mean([f["face_detected"] for f in seg]))
            pose_vis = float(np.mean([f["pose_detected"] for f in seg]))
            face_area = float(np.mean([f["face_area"] for f in seg]))
            nx = [f["nose_x"] for f in seg if f["nose_x"] is not None]
            ny = [f["nose_y"] for f in seg if f["nose_y"] is not None]
            jitter = float(np.std(nx) + np.std(ny)) if len(nx) >= 2 and len(ny) >= 2 else 0.2
            head_stability = max(0.0, 1.0 - min(jitter * 5, 1.0))
            camera_presence = min(face_area / 0.08, 1.0)
            score = (0.35 * face_vis + 0.25 * pose_vis + 0.20 * head_stability + 0.20 * camera_presence) * 100
            timeline.append(
                {
                    "start": round(start, 2),
                    "end": round(end, 2),
                    "start_mmss": seconds_to_mmss(start),
                    "end_mmss": seconds_to_mmss(end),
                    "presentation_assurance_score": int(round(score)),
                    "status": "low" if score < 45 else "moderate" if score < 70 else "high",
                    "signals": {
                        "face_visibility": round(face_vis, 3),
                        "pose_visibility": round(pose_vis, 3),
                        "head_stability": round(float(head_stability), 3),
                        "camera_presence": round(float(camera_presence), 3),
                    },
                }
            )
            start = end
        lowest = sorted(timeline, key=lambda x: x["presentation_assurance_score"])[:3]
        return {
            "global_visual_assurance_score": int(round(np.mean([x["presentation_assurance_score"] for x in timeline]))),
            "visual_assurance_timeline": timeline,
            "lowest_visual_assurance_segments": lowest,
        }


class VoiceAssuranceTimeline:
    def __init__(self, model_name: str):
        if AutoFeatureExtractor is None or AutoModelForAudioClassification is None or torch is None or F is None:
            raise RuntimeError("Missing dependencies: transformers and torch are required for voice emotion analysis.")
        self.feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
        self.model = AutoModelForAudioClassification.from_pretrained(model_name)
        if USE_CUDA:
            self.model = self.model.cuda()
        self.id2label = self.model.config.id2label

    def run(self, audio_path: str, segment_sec: float = 5.0) -> Dict[str, Any]:
        if librosa is None:
            raise RuntimeError("Missing dependency: librosa is required for voice assurance analysis.")
        try:
            y, sr = librosa.load(audio_path, sr=16000)
        except Exception:
            return {
                "global_voice_assurance_score": 0,
                "voice_assurance_timeline": [],
                "lowest_voice_assurance_segments": [],
            }
        total_duration = librosa.get_duration(y=y, sr=sr)
        if total_duration <= 0:
            return {
                "global_voice_assurance_score": 0,
                "voice_assurance_timeline": [],
                "lowest_voice_assurance_segments": [],
            }
        timeline = []
        start = 0.0
        while start < total_duration:
            end = min(start + segment_sec, total_duration)
            s_idx = int(start * sr)
            e_idx = int(end * sr)
            seg = y[s_idx:e_idx]
            if len(seg) < sr:
                start = end
                continue
            inputs = self.feature_extractor(seg, sampling_rate=sr, return_tensors="pt", padding=True)
            if USE_CUDA:
                inputs = {k: v.cuda() for k, v in inputs.items()}
            with torch.no_grad():
                logits = self.model(**inputs).logits
                probs = F.softmax(logits, dim=-1)[0].detach().cpu().numpy()
            prob_map = {self.id2label[i].lower(): float(probs[i]) for i in range(len(probs))}
            assurance_like = (
                prob_map.get("neutral", 0.0) * 0.55
                + prob_map.get("happy", 0.0) * 0.45
                + prob_map.get("calm", 0.0) * 0.50
            )
            tension_like = (
                prob_map.get("fearful", 0.0) * 0.50
                + prob_map.get("sad", 0.0) * 0.15
                + prob_map.get("angry", 0.0) * 0.20
            )
            score = max(0.0, min(1.0, 0.55 + assurance_like - tension_like)) * 100
            top_label = max(prob_map.items(), key=lambda x: x[1])[0] if prob_map else "unknown"
            timeline.append(
                {
                    "start": round(start, 2),
                    "end": round(end, 2),
                    "start_mmss": seconds_to_mmss(start),
                    "end_mmss": seconds_to_mmss(end),
                    "voice_assurance_score": int(round(score)),
                    "dominant_emotion_label": top_label,
                    "status": "low" if score < 45 else "moderate" if score < 70 else "high",
                    "emotion_probs": {k: round(v, 3) for k, v in sorted(prob_map.items())},
                }
            )
            start = end
        lowest = sorted(timeline, key=lambda x: x["voice_assurance_score"])[:3]
        return {
            "global_voice_assurance_score": int(round(np.mean([x["voice_assurance_score"] for x in timeline]))) if timeline else 0,
            "voice_assurance_timeline": timeline,
            "lowest_voice_assurance_segments": lowest,
        }


# =========================================================
# 8) AGENTIC CONTROLLERS
# =========================================================
TOOL_DESCRIPTIONS = {
    "extract_audio": "Extract mono 16kHz WAV audio from the video. Required before transcription and audio analysis.",
    "transcribe_audio": "Transcribe speech from extracted audio into timestamped text segments.",
    "analyze_audio": "Compute duration, word count, WPM, energy, filler count, and sentence length.",
    "analyze_delivery": "Convert audio features into delivery fluency observations and a score.",
    "analyze_content": "Use an LLM to analyze transcript content: problem, customer, solution, value, proof, ask, etc.",
    "analyze_narrative": "Use an LLM to analyze narrative flow, opening, solution flow, proof, memorability, and closing.",
    "sample_frames": "Sample video frames for visual analysis.",
    "analyze_visuals": "Analyze sampled frames for face visibility, pose visibility, framing, and head stability cues.",
    "analyze_presence": "Convert visual features into physical presence observations and a score.",
    "analyze_visual_assurance": "Build a timestamped visual presentation-assurance timeline from visual features.",
    "analyze_voice_assurance": "Build a timestamped vocal presentation-assurance timeline from audio.",
    "generate_rewrite": "Generate improved opening and closing suggestions from transcript.",
    "write_report": "Stop gathering evidence and write the final report.",
}

TOOL_PREREQUISITES = {
    "extract_audio": [],
    "transcribe_audio": ["audio_path"],
    "analyze_audio": ["audio_path", "transcript"],
    "analyze_delivery": ["audio_features"],
    "analyze_content": ["transcript"],
    "analyze_narrative": ["transcript"],
    "sample_frames": [],
    "analyze_visuals": ["frame_paths"],
    "analyze_presence": ["visual_features"],
    "analyze_visual_assurance": ["visual_features"],
    "analyze_voice_assurance": ["audio_path"],
    "generate_rewrite": ["transcript"],
    "write_report": ["transcript"],
}


def state_available_keys(state: AgentState) -> set:
    return set(state.observations.keys()) | set(state.analyses.keys())


def has_prerequisites(tool_name: str, state: AgentState) -> bool:
    required = TOOL_PREREQUISITES.get(tool_name, [])
    available = state_available_keys(state)
    return all(req in available for req in required)


def choose_safe_fallback_tool(state: AgentState, config: PitchCoachConfig) -> str:
    if "audio_path" not in state.observations:
        return "extract_audio"
    if "transcript" not in state.observations:
        return "transcribe_audio"
    if "audio_features" not in state.analyses:
        return "analyze_audio"
    if "delivery" not in state.analyses:
        return "analyze_delivery"
    if "content" not in state.analyses:
        return "analyze_content"
    if "narrative" not in state.analyses:
        return "analyze_narrative"
    if not config.skip_visual:
        if "frame_paths" not in state.observations:
            return "sample_frames"
        if "visual_features" not in state.analyses:
            return "analyze_visuals"
        if "presence" not in state.analyses:
            return "analyze_presence"
        if "visual_assurance" not in state.analyses:
            return "analyze_visual_assurance"
    if not config.skip_voice_emotion:
        if "voice_assurance" not in state.analyses:
            return "analyze_voice_assurance"
    if "rewrites" not in state.analyses:
        return "generate_rewrite"
    return "write_report"


class AgentPlanner:
    def __init__(self, llm: LLMClient, config: PitchCoachConfig):
        self.llm = llm
        self.config = config

    def decide(self, state: AgentState) -> Dict[str, Any]:
        disabled = []
        if self.config.skip_visual:
            disabled += ["sample_frames", "analyze_visuals", "analyze_presence", "analyze_visual_assurance"]
        if self.config.skip_voice_emotion:
            disabled += ["analyze_voice_assurance"]
        available_tools = {k: v for k, v in TOOL_DESCRIPTIONS.items() if k not in disabled}
        prompt = f"""
You are the controller of a multimodal pitch-coaching agent.

Your job is to choose the next best tool call. The Python runtime will execute the tool safely.

Available tools:
{json.dumps(available_tools, ensure_ascii=False, indent=2)}

Prerequisites:
{json.dumps(TOOL_PREREQUISITES, ensure_ascii=False, indent=2)}

Rules:
- Choose exactly one next_tool.
- Do not choose a tool whose prerequisites are missing.
- Prefer lower-cost evidence before expensive evidence.
- A transcript is necessary for any meaningful coaching.
- Content and narrative analysis are necessary before final report.
- Delivery analysis is necessary before final report.
- If visual analysis is not skipped, sample_frames, analyze_visuals, analyze_presence, and analyze_visual_assurance must be completed before final report.
- If voice emotion analysis is not skipped, analyze_voice_assurance must be completed before final report.
- Do not repeat tools unless there is a clear reason.
- Stop with write_report only when all required evidence exists.
- Return strict JSON only.

Current state:
{json.dumps(state.to_dict(), ensure_ascii=False, indent=2)}

Return exactly:
{{
  "next_tool": "tool_name",
  "reason": "why this is the best next action",
  "args": {{}},
  "done": false
}}
"""
        fallback = {
            "next_tool": choose_safe_fallback_tool(state, self.config),
            "reason": "Fallback planner decision.",
            "args": {},
            "done": False,
        }
        return llm_json(self.llm, prompt, max_tokens=650, temperature=0.1, fallback=fallback)


class EvidenceSufficiencyAgent:
    def __init__(self, llm: LLMClient, config: PitchCoachConfig):
        self.llm = llm
        self.config = config

    def run(self, state: AgentState) -> Dict[str, Any]:
        # This hard gate intentionally forces all enabled analyses before reporting.
        # It prevents stopping after only transcript + audio + content + narrative.
        mandatory = self.heuristic(state)
        if not mandatory.get("enough_evidence"):
            return mandatory

        prompt = f"""
You are deciding whether a pitch-coaching agent has enough evidence to write a useful final report.

Current state:
{json.dumps(state.to_dict(), ensure_ascii=False, indent=2)}

Rules:
- enough_evidence can be true only if all required analyses are complete.
- Required analyses: transcript, audio_features, delivery, content, narrative.
- If visual analysis is not skipped, required visual analyses are: frame_paths, visual_features, presence, visual_assurance.
- If voice emotion analysis is not skipped, required voice analysis is: voice_assurance.
- If enough evidence exists, explain why.
- Return strict JSON only.

Return exactly:
{{
  "enough_evidence": true,
  "missing_evidence": [],
  "recommended_next_tool": "tool_name_or_none",
  "reason": "short reason"
}}
"""
        fallback = mandatory
        result = llm_json(self.llm, prompt, max_tokens=500, temperature=0.1, fallback=fallback)
        # Never allow the LLM to weaken the hard gate.
        if not mandatory.get("enough_evidence"):
            return mandatory
        return result

    def heuristic(self, state: AgentState) -> Dict[str, Any]:
        if "audio_path" not in state.observations:
            return {
                "enough_evidence": False,
                "missing_evidence": ["audio_path"],
                "recommended_next_tool": "extract_audio",
                "reason": "Audio must be extracted from the video first.",
            }

        if "transcript" not in state.observations:
            return {
                "enough_evidence": False,
                "missing_evidence": ["transcript"],
                "recommended_next_tool": "transcribe_audio",
                "reason": "Transcript is required before pitch coaching.",
            }

        required_analysis = [
            ("audio_features", "analyze_audio"),
            ("delivery", "analyze_delivery"),
            ("content", "analyze_content"),
            ("narrative", "analyze_narrative"),
        ]

        if not self.config.skip_visual:
            if "frame_paths" not in state.observations:
                return {
                    "enough_evidence": False,
                    "missing_evidence": ["frame_paths"],
                    "recommended_next_tool": "sample_frames",
                    "reason": "Visual analysis is enabled, so frames must be sampled.",
                }
            required_analysis += [
                ("visual_features", "analyze_visuals"),
                ("presence", "analyze_presence"),
                ("visual_assurance", "analyze_visual_assurance"),
            ]

        if not self.config.skip_voice_emotion:
            required_analysis += [("voice_assurance", "analyze_voice_assurance")]

        for key, tool in required_analysis:
            if key not in state.analyses:
                return {
                    "enough_evidence": False,
                    "missing_evidence": [key],
                    "recommended_next_tool": tool,
                    "reason": f"Required analysis is missing: {key}.",
                }

        return {
            "enough_evidence": True,
            "missing_evidence": [],
            "recommended_next_tool": "none",
            "reason": "All required transcript, audio, delivery, content, narrative, and enabled visual/voice analyses are complete.",
        }


class CoachingStrategyAgent:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def run(self, state: AgentState) -> Dict[str, Any]:
        prompt = f"""
You are a senior pitch coach. Create a coaching strategy from the evidence.

Do not use generic advice. Every recommendation must be grounded in evidence from the state.
Do not invent metrics, traction, customers, revenue, team credentials, or emotions.
Use careful wording: say "presentation cues" or "assurance cues", never claim internal psychology.

Current state:
{json.dumps(state.to_dict(), ensure_ascii=False, indent=2)}

Return strict JSON exactly:
{{
  "dominant_problem": "...",
  "why_this_is_dominant": "...",
  "top_priorities": [
    {{
      "priority": 1,
      "area": "...",
      "evidence": "...",
      "coaching_action": "...",
      "success_test": "..."
    }}
  ],
  "what_not_to_focus_on_yet": [
    {{"area": "...", "reason": "..."}}
  ],
  "next_best_action": {{
    "action": "...",
    "why": "...",
    "success_test": "..."
  }}
}}
"""
        fallback = {
            "dominant_problem": "The report should focus on evidence-backed clarity and structure.",
            "why_this_is_dominant": "Fallback strategy used due to invalid LLM output.",
            "top_priorities": [],
            "what_not_to_focus_on_yet": [],
            "next_best_action": {
                "action": "Review the transcript and make the core pitch claim clearer.",
                "why": "A clear message is the foundation for useful pitch coaching.",
                "success_test": "A listener can repeat the problem, solution, and next step after one listen.",
            },
        }
        return llm_json(self.llm, prompt, max_tokens=1200, temperature=0.2, fallback=fallback)


class ReportPlanningAgent:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def run(self, state: AgentState, strategy: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
You are planning the final pitch coaching report.
Choose the sections that best serve this specific evidence and strategy.
Do not include sections that rely on missing evidence.

Current state:
{json.dumps(state.to_dict(), ensure_ascii=False, indent=2)}

Coaching strategy:
{json.dumps(strategy, ensure_ascii=False, indent=2)}

Return strict JSON exactly:
{{
  "report_sections": [
    {{
      "title": "...",
      "purpose": "...",
      "include": true,
      "reason": "..."
    }}
  ]
}}
"""
        fallback = {
            "report_sections": [
                {"title": "Executive Summary", "purpose": "Summarize the main diagnosis.", "include": True, "reason": "Always useful."},
                {"title": "Top Priorities", "purpose": "Show what to improve first.", "include": True, "reason": "Strategy includes priorities."},
                {"title": "Evidence-Based Coaching", "purpose": "Connect evidence to recommendations.", "include": True, "reason": "Required for trust."},
                {"title": "Next Best Action", "purpose": "Give the user one immediate step.", "include": True, "reason": "Improves actionability."},
            ]
        }
        return llm_json(self.llm, prompt, max_tokens=800, temperature=0.2, fallback=fallback)


class AgenticReportWriter:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def run(self, state: AgentState, strategy: Dict[str, Any], report_plan: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
Write the final pitch coaching report.

Rules:
- Follow the report plan.
- Use only evidence from the state.
- Make advice specific to this pitch.
- Do not print raw JSON lists as the report.
- Do not invent metrics, traction, revenue, customers, team credentials, or emotions.
- Use "presentation cues", "visual assurance cues", or "vocal assurance cues" instead of psychological claims.
- Every critical issue must have evidence, impact, and fix.
- End with the next best action.
- Markdown must be professional and readable.

State:
{json.dumps(state.to_dict(), ensure_ascii=False, indent=2)}

Strategy:
{json.dumps(strategy, ensure_ascii=False, indent=2)}

Report plan:
{json.dumps(report_plan, ensure_ascii=False, indent=2)}

Return strict JSON exactly:
{{
  "title": "...",
  "markdown_report": "...",
  "diagnostic_summary": {{}},
  "next_best_action": {{}},
  "limitations": []
}}
"""
        fallback = {
            "title": "Pitch Coaching Report",
            "markdown_report": "# Pitch Coaching Report\n\nThe report writer returned invalid JSON. Review the diagnostic JSON for available evidence.",
            "diagnostic_summary": {},
            "next_best_action": strategy.get("next_best_action", {}),
            "limitations": ["Fallback report used because the report writer output was invalid."],
        }
        return llm_json(self.llm, prompt, max_tokens=2600, temperature=0.25, fallback=fallback)


class AgentJudge:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def run(self, state: AgentState, strategy: Dict[str, Any], report: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
You are the judge of an agentic pitch-coaching system.

Check whether the report is:
- evidence-based
- specific
- useful
- free from invented facts
- free from unsupported psychological claims
- aligned with available evidence

You may approve the report, request a revision, or request one more evidence-gathering tool.

Allowed evidence tools:
{json.dumps(list(TOOL_DESCRIPTIONS.keys()), ensure_ascii=False)}

State:
{json.dumps(state.to_dict(), ensure_ascii=False, indent=2)}

Strategy:
{json.dumps(strategy, ensure_ascii=False, indent=2)}

Draft report:
{json.dumps(report, ensure_ascii=False, indent=2)}

Return strict JSON exactly:
{{
  "approved": true,
  "quality_score": 0,
  "issues": [],
  "requires_more_evidence": false,
  "recommended_tool": null,
  "revision_instructions": []
}}
"""
        fallback = {
            "approved": True,
            "quality_score": 70,
            "issues": ["Fallback judge approval used due to invalid judge output."],
            "requires_more_evidence": False,
            "recommended_tool": None,
            "revision_instructions": [],
        }
        return llm_json(self.llm, prompt, max_tokens=1000, temperature=0.1, fallback=fallback)


class ReportRevisionAgent:
    def __init__(self, llm: LLMClient):
        self.llm = llm

    def run(self, state: AgentState, strategy: Dict[str, Any], report: Dict[str, Any], judge_result: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
Revise the pitch coaching report according to the judge result.

Rules:
- Fix the judge's issues.
- Do not invent facts.
- Keep evidence-grounded advice.
- Preserve professional Markdown.
- Remove unsupported psychological claims.

State:
{json.dumps(state.to_dict(), ensure_ascii=False, indent=2)}

Strategy:
{json.dumps(strategy, ensure_ascii=False, indent=2)}

Current report:
{json.dumps(report, ensure_ascii=False, indent=2)}

Judge result:
{json.dumps(judge_result, ensure_ascii=False, indent=2)}

Return strict JSON exactly:
{{
  "title": "...",
  "markdown_report": "...",
  "diagnostic_summary": {{}},
  "next_best_action": {{}},
  "limitations": []
}}
"""
        return llm_json(self.llm, prompt, max_tokens=2600, temperature=0.15, fallback=report)


class Rewriter:
    def __init__(self, llm: Optional[LLMClient]):
        self.llm = llm

    def run(self, transcript: str) -> List[Dict[str, str]]:
        sents = split_sentences(transcript)
        opening = " ".join(sents[:2]) if sents else transcript[:240]
        closing = " ".join(sents[-2:]) if sents else transcript[-240:]
        if self.llm is None:
            return [
                {"part": "opening", "original": opening, "improved": opening},
                {"part": "closing", "original": closing, "improved": closing},
            ]
        prompt = f"""
Rewrite the opening and closing of this pitch to make them stronger.

Rules:
- Keep original facts only.
- Do not invent traction, metrics, customers, revenue, or funding.
- You may add placeholders like [TARGET CUSTOMER], [PAIN POINT], [SOLUTION], [ASK], or [PROOF POINT].
- The improved version should be more pitch-like, not just a grammar correction.
- The opening should include: speaker + company + problem + target customer.
- The closing should include: company + value + clear ask or next step.
- Return strict JSON.

Opening:
{opening}

Closing:
{closing}

Return exactly:
{{
  "rewrites": [
    {{
      "part": "opening",
      "original": "...",
      "improved": "..."
    }},
    {{
      "part": "closing",
      "original": "...",
      "improved": "..."
    }}
  ]
}}
"""
        parsed = llm_json(self.llm, prompt, max_tokens=800, temperature=0.25, fallback={"rewrites": []})
        rewrites = parsed.get("rewrites", [])
        if not isinstance(rewrites, list) or not rewrites:
            return [
                {"part": "opening", "original": opening, "improved": opening},
                {"part": "closing", "original": closing, "improved": closing},
            ]
        return sanitize_language(rewrites)


# =========================================================
# 9) TOOL EXECUTOR
# =========================================================
class ToolExecutor:
    def __init__(self, agent: "AgenticPitchCoach"):
        self.agent = agent

    def run(self, tool_name: str, args: Dict[str, Any], state: AgentState) -> Any:
        log(f"TOOL: {tool_name}")

        if tool_name == "extract_audio":
            video_path = Path(state.video_path)
            audio_path = self.agent.audio_extractor.run(video_path)
            state.observations["audio_path"] = audio_path
            return {"audio_path": audio_path}

        if tool_name == "transcribe_audio":
            audio_path = state.observations["audio_path"]
            transcript_data = self.agent.transcriber.run(audio_path)
            state.observations["transcript_data"] = transcript_data
            state.observations["transcript"] = transcript_data.get("text", "")
            state.observations["language"] = transcript_data.get("language")
            state.observations["transcript_segment_count"] = len(transcript_data.get("segments", []))
            return {
                "language": transcript_data.get("language"),
                "segment_count": len(transcript_data.get("segments", [])),
                "text_preview": transcript_data.get("text", "")[:1200],
            }

        if tool_name == "analyze_audio":
            audio_path = state.observations["audio_path"]
            transcript = state.observations.get("transcript", "")
            result = self.agent.audio_stats.run(audio_path, transcript)
            state.analyses["audio_features"] = result
            return result

        if tool_name == "analyze_delivery":
            audio_features = state.analyses["audio_features"]
            result = self.agent.delivery_stats.run(audio_features)
            state.analyses["delivery"] = result
            return result

        if tool_name == "analyze_content":
            transcript = state.observations["transcript"]
            result = self.agent.content_analyzer.run(transcript)
            state.analyses["content"] = result
            return result

        if tool_name == "analyze_narrative":
            transcript = state.observations["transcript"]
            result = self.agent.narrative_analyzer.run(transcript)
            state.analyses["narrative"] = result
            return result

        if tool_name == "sample_frames":
            if self.agent.config.skip_visual or self.agent.frame_sampler is None:
                result = {"skipped": True, "reason": "Visual analysis disabled."}
                state.analyses["visual_skipped"] = result
                return result
            video_path = Path(state.video_path)
            result = self.agent.frame_sampler.run(video_path)
            state.observations["frame_paths"] = result
            return {"sampled_frame_count": len(result)}

        if tool_name == "analyze_visuals":
            if self.agent.config.skip_visual or self.agent.visual_stats is None:
                result = {"skipped": True, "reason": "Visual analysis disabled."}
                state.analyses["visual_features"] = empty_visual_features()
                return result
            frame_paths = state.observations["frame_paths"]
            result = self.agent.visual_stats.run(frame_paths)
            state.analyses["visual_features"] = result
            return {
                "sampled_frames": result.get("sampled_frames"),
                "face_detected_ratio": result.get("face_detected_ratio"),
                "pose_detected_ratio": result.get("pose_detected_ratio"),
                "avg_face_area": result.get("avg_face_area"),
                "nose_x_std": result.get("nose_x_std"),
                "nose_y_std": result.get("nose_y_std"),
            }

        if tool_name == "analyze_presence":
            visual_features = state.analyses.get("visual_features", empty_visual_features())
            result = self.agent.presence_stats.run(visual_features)
            state.analyses["presence"] = result
            return result

        if tool_name == "analyze_visual_assurance":
            visual_features = state.analyses.get("visual_features", empty_visual_features())
            result = self.agent.visual_assurance_timeline.run(visual_features)
            state.analyses["visual_assurance"] = result
            return result

        if tool_name == "analyze_voice_assurance":
            audio_path = state.observations["audio_path"]
            if self.agent.voice_assurance_timeline is None:
                result = {
                    "global_voice_assurance_score": 0,
                    "voice_assurance_timeline": [],
                    "lowest_voice_assurance_segments": [],
                    "skipped": True,
                    "reason": "Voice assurance model unavailable or disabled.",
                }
            else:
                result = self.agent.voice_assurance_timeline.run(
                    audio_path,
                    segment_sec=self.agent.config.confidence_segment_sec,
                )
            state.analyses["voice_assurance"] = result
            return result

        if tool_name == "generate_rewrite":
            transcript = state.observations["transcript"]
            result = self.agent.rewriter.run(transcript)
            state.analyses["rewrites"] = result
            return result

        if tool_name == "write_report":
            return {"done": True}

        raise ValueError(f"Unknown tool: {tool_name}")


# =========================================================
# 10) SCORECARD BUILDER
# =========================================================
class ScorecardBuilder:
    def build(self, state: AgentState, config: PitchCoachConfig) -> Dict[str, Any]:
        content = state.analyses.get("content", {})
        narrative = state.analyses.get("narrative", {})
        audio = state.analyses.get("audio_features", {})
        delivery = state.analyses.get("delivery", {})
        visual = state.analyses.get("visual_features", {})
        presence = state.analyses.get("presence", {})
        visual_assurance = state.analyses.get("visual_assurance", {})
        voice_assurance = state.analyses.get("voice_assurance", {})

        content_score = int(content.get("score", 0))
        narrative_score = int(narrative.get("score", 0))
        delivery_score = int(delivery.get("score", self._delivery_score_from_audio(audio)))
        visual_score = int(presence.get("score", self._visual_score_from_features(visual)))
        visual_assurance_score = int(visual_assurance.get("global_visual_assurance_score", 0))
        voice_assurance_score = int(voice_assurance.get("global_voice_assurance_score", 0))
        evidence_score = self._evidence_quality_score(state)

        criteria = [
            {
                "id": "content_clarity",
                "label": "Content clarity",
                "score": content_score,
                "status": self._status(content_score),
                "evidence": {
                    "covered_parts": content.get("covered_parts", []),
                    "missing_parts": content.get("missing_parts", []),
                    "weak_parts": content.get("weak_parts", []),
                    "has_metrics": content.get("has_metrics", False),
                    "main_content_issue": content.get("main_content_issue", ""),
                },
                "what_it_means": "How clearly the pitch explains problem, customer, solution, value, proof, and ask.",
            },
            {
                "id": "narrative_strength",
                "label": "Narrative strength",
                "score": narrative_score,
                "status": self._status(narrative_score),
                "evidence": narrative.get("signals", {}),
                "what_it_means": "How well the pitch flows from opening to problem, solution, proof, and closing.",
            },
            {
                "id": "delivery_fluency",
                "label": "Delivery fluency",
                "score": delivery_score,
                "status": self._status(delivery_score),
                "evidence": {
                    "words_per_minute": round(audio.get("words_per_minute", 0), 2),
                    "filler_count": audio.get("filler_count", 0),
                    "mean_energy": round(audio.get("mean_energy", 0), 5),
                    "avg_sentence_length_words": round(audio.get("avg_sentence_length_words", 0), 2),
                },
                "what_it_means": "How controlled, fluent, and listenable the spoken delivery appears from audio features.",
            },
            {
                "id": "visual_pitching",
                "label": "Visual pitching / camera presence",
                "score": visual_score,
                "status": self._status(visual_score),
                "evidence": {
                    "sampled_frames": visual.get("sampled_frames", 0),
                    "face_detected_ratio": round(visual.get("face_detected_ratio", 0), 3),
                    "pose_detected_ratio": round(visual.get("pose_detected_ratio", 0), 3),
                    "avg_face_area": round(visual.get("avg_face_area", 0), 4),
                    "nose_x_std": round(visual.get("nose_x_std", 0), 3),
                    "nose_y_std": round(visual.get("nose_y_std", 0), 3),
                    "skipped": config.skip_visual,
                },
                "what_it_means": "How visible, stable, and camera-ready the speaker appears. This is not a psychological claim.",
            },
            {
                "id": "visual_assurance_cues",
                "label": "Visual assurance cues",
                "score": visual_assurance_score,
                "status": self._status(visual_assurance_score),
                "evidence": {
                    "lowest_segments": visual_assurance.get("lowest_visual_assurance_segments", []),
                    "skipped": config.skip_visual,
                },
                "what_it_means": "Timestamped visual presentation cues such as framing, face visibility, pose visibility, and head stability.",
            },
            {
                "id": "vocal_assurance_cues",
                "label": "Vocal assurance cues",
                "score": voice_assurance_score,
                "status": self._status(voice_assurance_score),
                "evidence": {
                    "lowest_segments": voice_assurance.get("lowest_voice_assurance_segments", []),
                    "skipped": config.skip_voice_emotion or voice_assurance.get("skipped", False),
                },
                "what_it_means": "Optional vocal assurance cues. This is not a diagnosis of emotion or personality.",
            },
            {
                "id": "evidence_quality",
                "label": "Evidence quality",
                "score": evidence_score,
                "status": self._status(evidence_score),
                "evidence": {
                    "completed_tools": state.completed_tools,
                    "warnings": state.warnings,
                    "transcript_segment_count": state.observations.get("transcript_segment_count", 0),
                },
                "what_it_means": "How reliable the report is based on the amount and diversity of evidence collected.",
            },
        ]

        weights = {
            "content_clarity": 0.24,
            "narrative_strength": 0.20,
            "delivery_fluency": 0.18,
            "visual_pitching": 0.12,
            "visual_assurance_cues": 0.08,
            "vocal_assurance_cues": 0.08,
            "evidence_quality": 0.10,
        }

        numerator = 0.0
        denominator = 0.0
        for item in criteria:
            weight = weights.get(item["id"], 0)
            if item["id"] in ["visual_pitching", "visual_assurance_cues"] and config.skip_visual:
                continue
            if item["id"] == "vocal_assurance_cues" and config.skip_voice_emotion:
                continue
            if item["id"] == "vocal_assurance_cues" and voice_assurance.get("skipped", False):
                continue
            numerator += item["score"] * weight
            denominator += weight

        overall = int(round(numerator / denominator)) if denominator else 0

        return {
            "overall_score": overall,
            "overall_status": self._status(overall),
            "scoring_scale": {
                "0_39": "Weak",
                "40_59": "Needs work",
                "60_74": "Acceptable",
                "75_89": "Strong",
                "90_100": "Excellent",
            },
            "criteria": criteria,
            "summary": {
                "strongest_criteria": self._top(criteria, reverse=True),
                "weakest_criteria": self._top(criteria, reverse=False),
                "agent_completed_tools": state.completed_tools,
                "important_note": "Visual and vocal assurance scores are presentation cues, not psychological diagnoses.",
            },
        }

    def _delivery_score_from_audio(self, audio: Dict[str, Any]) -> int:
        if not audio:
            return 0
        wpm = audio.get("words_per_minute", 0)
        fillers = audio.get("filler_count", 0)
        avg_sentence = audio.get("avg_sentence_length_words", 0)
        score = 60
        if 110 <= wpm <= 170:
            score += 15
        elif 90 <= wpm <= 190:
            score += 7
        else:
            score -= 8
        score -= min(18, fillers * 2)
        if avg_sentence > 24:
            score -= 8
        return clamp_score(score)

    def _visual_score_from_features(self, visual: Dict[str, Any]) -> int:
        if not visual or visual.get("sampled_frames", 0) == 0:
            return 0
        face_ratio = visual.get("face_detected_ratio", 0)
        pose_ratio = visual.get("pose_detected_ratio", 0)
        nose_x_std = visual.get("nose_x_std", 0)
        nose_y_std = visual.get("nose_y_std", 0)
        face_area = visual.get("avg_face_area", 0)
        score = 55
        score += 15 if face_ratio >= 0.7 else (-3 if face_ratio < 0.4 else 4)
        score += 10 if pose_ratio >= 0.5 else (-2 if pose_ratio < 0.25 else 3)
        score += 8 if (nose_x_std <= 0.08 and nose_y_std <= 0.08) else -6
        score += 3 if face_area >= 0.04 else -2
        return clamp_score(score)

    def _evidence_quality_score(self, state: AgentState) -> int:
        score = 20
        for tool, points in [
            ("transcribe_audio", 15),
            ("analyze_audio", 10),
            ("analyze_delivery", 10),
            ("analyze_content", 15),
            ("analyze_narrative", 15),
            ("analyze_visuals", 10),
            ("analyze_presence", 5),
            ("analyze_visual_assurance", 5),
            ("analyze_voice_assurance", 5),
        ]:
            if tool in state.completed_tools:
                score += points
        if state.warnings:
            score -= min(20, len(state.warnings) * 5)
        return clamp_score(score)

    def _status(self, score: int) -> str:
        score = int(score)
        if score >= 90:
            return "Excellent"
        if score >= 75:
            return "Strong"
        if score >= 60:
            return "Acceptable"
        if score >= 40:
            return "Needs work"
        return "Weak"

    def _top(self, criteria: List[Dict[str, Any]], reverse: bool) -> List[Dict[str, Any]]:
        valid = [c for c in criteria if c.get("score", 0) > 0]
        items = sorted(valid, key=lambda x: x.get("score", 0), reverse=reverse)[:3]
        return [{"id": x["id"], "label": x["label"], "score": x["score"], "status": x["status"]} for x in items]


# =========================================================
# 11) JUDGE NORMALIZATION
# =========================================================
def normalize_judge_result(judge_result: Dict[str, Any]) -> Dict[str, Any]:
    judge_result = judge_result if isinstance(judge_result, dict) else {}
    approved = bool(judge_result.get("approved", False))
    quality_score = judge_result.get("quality_score", 0)

    try:
        quality_score = int(quality_score)
    except Exception:
        quality_score = 0

    quality_score = clamp_score(quality_score)

    if approved and quality_score < 60:
        quality_score = 70
        issues = judge_result.get("issues", [])
        if not isinstance(issues, list):
            issues = []
        issues.append("Judge approved the report but gave an unusually low score; score normalized to 70.")
        judge_result["issues"] = issues

    judge_result["approved"] = approved
    judge_result["quality_score"] = quality_score
    judge_result.setdefault("issues", [])
    judge_result.setdefault("requires_more_evidence", False)
    judge_result.setdefault("recommended_tool", None)
    judge_result.setdefault("revision_instructions", [])
    return sanitize_language(judge_result)


# =========================================================
# 12) MAIN AGENT
# =========================================================
class AgenticPitchCoach:
    def __init__(self, config: PitchCoachConfig):
        self.config = config
        self.config.prepare_dirs()
        self.runtime_warnings: List[str] = []

        if config.disable_llm:
            raise RuntimeError("This completed agentic version requires an LLM. Remove --disable-llm.")

        self.llm = LLMClient(config)
        self.audio_extractor = AudioExtractor(config.audio_dir)
        self.transcriber = Transcriber(config.whisper_size)
        self.audio_stats = AudioStats()
        self.delivery_stats = DeliveryStats()

        self.frame_sampler = None if config.skip_visual else FrameSampler(config.frames_dir, config.frame_every_sec, config.max_frames)
        self.visual_stats = None if config.skip_visual else VisualStats()
        self.presence_stats = PresenceStats()
        self.visual_assurance_timeline = VisualAssuranceTimeline(config.confidence_segment_sec)

        self.voice_assurance_timeline = None
        if not config.skip_voice_emotion:
            try:
                self.voice_assurance_timeline = VoiceAssuranceTimeline(config.voice_emotion_model)
            except Exception as exc:
                self.runtime_warnings.append(f"Voice assurance model unavailable: {exc}")
                self.voice_assurance_timeline = None

        self.content_analyzer = LLMContentAnalyzer(self.llm)
        self.narrative_analyzer = LLMNarrativeAnalyzer(self.llm)
        self.rewriter = Rewriter(self.llm)

        self.planner = AgentPlanner(self.llm, config)
        self.evidence_agent = EvidenceSufficiencyAgent(self.llm, config)
        self.strategy_agent = CoachingStrategyAgent(self.llm)
        self.report_planner = ReportPlanningAgent(self.llm)
        self.report_writer = AgenticReportWriter(self.llm)
        self.judge = AgentJudge(self.llm)
        self.revision_agent = ReportRevisionAgent(self.llm)
        self.scorecard_builder = ScorecardBuilder()
        self.executor = ToolExecutor(self)

    def run(self) -> Dict[str, Any]:
        video_path = ensure_file_exists(self.config.video_path, "video")
        state = AgentState(
            video_path=str(video_path),
            output_dir=str(self.config.root),
            goal="Coach this pitch using all enabled multimodal evidence before writing the report.",
            coaching_mode=self.config.coaching_mode,
            observations={},
            analyses={},
            decisions=[],
            tool_results=[],
            warnings=list(self.runtime_warnings),
            completed_tools=[],
            max_steps=self.config.max_agent_steps,
        )

        log("AGENT: starting evidence-gathering loop")
        while state.step_count < state.max_steps:
            sufficiency = self.evidence_agent.run(state)
            state.decisions.append({"type": "evidence_sufficiency", **sufficiency})

            if sufficiency.get("enough_evidence"):
                log("AGENT: enough evidence detected")
                break

            recommended = sufficiency.get("recommended_next_tool")
            if recommended and recommended != "none" and recommended in TOOL_DESCRIPTIONS:
                decision = {
                    "next_tool": recommended,
                    "reason": sufficiency.get("reason", "Evidence sufficiency agent recommended this tool."),
                    "args": {},
                    "done": False,
                }
            else:
                decision = self.planner.decide(state)

            tool_name = decision.get("next_tool")

            if tool_name not in TOOL_DESCRIPTIONS:
                fallback = choose_safe_fallback_tool(state, self.config)
                state.warnings.append(f"Planner selected unknown tool {tool_name}; using fallback {fallback}.")
                tool_name = fallback

            if not has_prerequisites(tool_name, state):
                fallback = choose_safe_fallback_tool(state, self.config)
                state.warnings.append(f"Planner selected {tool_name}, but prerequisites were missing; using fallback {fallback}.")
                tool_name = fallback

            if tool_name == "write_report":
                # Avoid early report if hard gate says evidence is not enough.
                hard_gate = self.evidence_agent.heuristic(state)
                if not hard_gate.get("enough_evidence"):
                    tool_name = hard_gate.get("recommended_next_tool", choose_safe_fallback_tool(state, self.config))
                    state.warnings.append(f"Planner tried write_report early; using required tool {tool_name}.")
                else:
                    break

            try:
                result = self.executor.run(tool_name, decision.get("args", {}), state)
            except Exception as exc:
                state.warnings.append(f"Tool {tool_name} failed: {exc}")
                log(f"WARNING: tool {tool_name} failed: {exc}")
                if tool_name not in state.completed_tools:
                    state.completed_tools.append(tool_name)
                state.step_count += 1
                continue

            state.add_tool_result(tool_name, result, decision.get("reason", ""))
            state.decisions.append({"type": "tool_decision", **decision, "executed_tool": tool_name})
            state.step_count += 1

        if "transcript" not in state.observations:
            raise RuntimeError("Agent could not obtain a transcript; cannot produce a useful coaching report.")

        # Make rewrite generation mandatory before report output if possible.
        if "rewrites" not in state.analyses:
            try:
                result = self.executor.run("generate_rewrite", {}, state)
                state.add_tool_result("generate_rewrite", result, "Final rewrite generation.")
            except Exception as exc:
                state.warnings.append(f"Rewrite generation failed: {exc}")

        log("AGENT: creating coaching strategy")
        strategy = self.strategy_agent.run(state)

        log("AGENT: planning report")
        report_plan = self.report_planner.run(state, strategy)

        log("AGENT: writing draft report")
        draft_report = self.report_writer.run(state, strategy, report_plan)

        judge_result: Dict[str, Any] = {}
        final_report = draft_report
        log("AGENT: judging and revising report")
        for round_idx in range(self.config.judge_revision_rounds):
            judge_result = normalize_judge_result(self.judge.run(state, strategy, final_report))
            judge_result["round"] = round_idx + 1
            if judge_result.get("approved"):
                break

            if judge_result.get("requires_more_evidence"):
                tool_name = judge_result.get("recommended_tool")
                if tool_name in TOOL_DESCRIPTIONS and tool_name != "write_report" and has_prerequisites(tool_name, state):
                    try:
                        result = self.executor.run(tool_name, {}, state)
                        state.add_tool_result(tool_name, result, "Judge requested more evidence.")
                        strategy = self.strategy_agent.run(state)
                        report_plan = self.report_planner.run(state, strategy)
                        final_report = self.report_writer.run(state, strategy, report_plan)
                        continue
                    except Exception as exc:
                        state.warnings.append(f"Judge-requested tool {tool_name} failed: {exc}")

            final_report = self.revision_agent.run(state, strategy, final_report, judge_result)

        scorecard = self.scorecard_builder.build(state, self.config)

        return {
            "video_path": str(video_path),
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "agent_state": state.to_dict(),
            "strategy": strategy,
            "report_plan": report_plan,
            "final_report": sanitize_language(final_report),
            "scorecard": scorecard,
            "judge_result": sanitize_language(judge_result),
            "runtime_warnings": state.warnings,
            "raw_state_full": {
                "observations": state.observations,
                "analyses": state.analyses,
                "decisions": state.decisions,
                "tool_results": state.tool_results,
            },
        }


# =========================================================
# 13) EXPORTERS
# =========================================================
def save_markdown(report_obj: Dict[str, Any], path: Path) -> None:
    final_report = report_obj.get("final_report", {})
    md = final_report.get("markdown_report") or "# Pitch Coaching Report\n\nNo Markdown report was generated."
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(md, encoding="utf-8")


def save_pdf_from_markdown(markdown_text: str, path: Path) -> bool:
    if SimpleDocTemplate is None or getSampleStyleSheet is None or Paragraph is None or Spacer is None or A4 is None:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    story = []

    for raw_line in markdown_text.splitlines():
        line = raw_line.strip()
        if not line:
            story.append(Spacer(1, 8))
            continue
        safe = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        safe = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", safe)
        if safe.startswith("# "):
            story.append(Paragraph(safe[2:], styles["Title"]))
        elif safe.startswith("## "):
            story.append(Paragraph(safe[3:], styles["Heading2"]))
        elif safe.startswith("### "):
            story.append(Paragraph(safe[4:], styles["Heading3"]))
        elif safe.startswith("- "):
            story.append(Paragraph("• " + safe[2:], styles["BodyText"]))
        else:
            story.append(Paragraph(safe, styles["BodyText"]))
    doc.build(story)
    return True


def print_report_summary(report_obj: Dict[str, Any]) -> None:
    final_report = report_obj.get("final_report", {})
    scorecard = report_obj.get("scorecard", {})
    title = final_report.get("title", "Pitch Coaching Report")
    next_action = final_report.get("next_best_action", {})
    judge = report_obj.get("judge_result", {})
    print("\n" + "=" * 90)
    print(title.upper())
    print("=" * 90)
    print(f"Overall score: {scorecard.get('overall_score', 'N/A')}/100 — {scorecard.get('overall_status', 'N/A')}")
    print("Criteria scores:")
    for item in scorecard.get("criteria", []):
        print(f" - {item.get('label')}: {item.get('score')}/100 — {item.get('status')}")
    if isinstance(next_action, dict) and next_action:
        print("Next best action:", next_action.get("action") or next_action)
    print("Judge quality score:", judge.get("quality_score", "N/A"))
    print("Approved:", judge.get("approved", "N/A"))
    warnings = report_obj.get("runtime_warnings", [])
    if warnings:
        print("Warnings:")
        for w in warnings[:8]:
            print(" -", w)


# =========================================================
# 14) CLI
# =========================================================
def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Completed agentic multimodal Pitch Coach Agent from a local video file.")
    p.add_argument("--video", required=True, help="Path to local video file, e.g. ./pitch.mp4")
    p.add_argument("--output", default="pitch_coach_output", help="Output directory")
    p.add_argument("--openai-base-url", default=os.getenv("OPENAI_BASE_URL", DEFAULT_OPENAI_BASE_URL))
    p.add_argument("--openai-model", default=os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL))
    p.add_argument("--openai-api-key", default=os.getenv("OPENAI_API_KEY"))
    p.add_argument("--whisper-size", default=DEFAULT_WHISPER_SIZE, choices=["tiny", "base", "small", "medium", "large-v3"])
    p.add_argument("--frame-every-sec", type=float, default=DEFAULT_FRAME_EVERY_SEC)
    p.add_argument("--confidence-segment-sec", type=float, default=DEFAULT_CONF_SEGMENT_SEC)
    p.add_argument("--voice-emotion-model", default=DEFAULT_VOICE_EMOTION_MODEL)
    p.add_argument("--skip-voice-emotion", action="store_true", help="Disable voice assurance model")
    p.add_argument("--skip-visual", action="store_true", help="Disable frame/MediaPipe visual analysis")
    p.add_argument("--disable-llm", action="store_true", help="Not supported in this completed agentic version")
    p.add_argument("--max-frames", type=int, default=None, help="Limit sampled frames for quick testing")
    p.add_argument("--max-agent-steps", type=int, default=20, help="Maximum tool-selection steps")
    p.add_argument("--judge-revision-rounds", type=int, default=2, help="Maximum judge/revision rounds")
    p.add_argument("--coaching-mode", default="investor", choices=["investor", "sales", "demo_day", "class_presentation", "founder_story"])
    return p


def main() -> None:
    args = build_arg_parser().parse_args()
    config = PitchCoachConfig(
        video_path=args.video,
        output_dir=args.output,
        openai_base_url=args.openai_base_url,
        openai_model=args.openai_model,
        openai_api_key=args.openai_api_key,
        whisper_size=args.whisper_size,
        frame_every_sec=args.frame_every_sec,
        confidence_segment_sec=args.confidence_segment_sec,
        voice_emotion_model=args.voice_emotion_model,
        skip_voice_emotion=args.skip_voice_emotion,
        skip_visual=args.skip_visual,
        disable_llm=args.disable_llm,
        max_frames=args.max_frames,
        max_agent_steps=args.max_agent_steps,
        judge_revision_rounds=args.judge_revision_rounds,
        coaching_mode=args.coaching_mode,
    )
    validate_runtime_requirements(config)
    agent = AgenticPitchCoach(config)
    report_obj = agent.run()

    report_json_path = config.report_dir / "agentic_pitch_coach_full_report.json"
    scorecard_json_path = config.report_dir / "agentic_pitch_coach_scorecard.json"
    markdown_path = config.report_dir / "agentic_pitch_coach_report.md"
    pdf_path = config.report_dir / "agentic_pitch_coach_report.pdf"

    save_json(report_obj, report_json_path)
    save_json(report_obj.get("scorecard", {}), scorecard_json_path)
    save_markdown(report_obj, markdown_path)
    md = report_obj.get("final_report", {}).get("markdown_report", "")
    pdf_ok = save_pdf_from_markdown(md, pdf_path)

    print_report_summary(report_obj)
    print(f"Saved full JSON report to: {report_json_path}")
    print(f"Saved clean scorecard JSON to: {scorecard_json_path}")
    print(f"Saved Markdown report to: {markdown_path}")
    if pdf_ok:
        print(f"Saved PDF report to: {pdf_path}")
    else:
        print("PDF not generated because reportlab is not installed. Install with: pip install reportlab")


if __name__ == "__main__":
    main()
