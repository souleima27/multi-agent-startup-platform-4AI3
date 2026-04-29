#!/usr/bin/env python3
"""
MCP stdio server for Agentic Pitch Coach.

Run with:
  python mcp_pitch_coach_server.py

The server exposes the pitch coach as MCP tools so MCP clients can launch a
local video analysis without shelling out to the CLI script directly.
"""

from __future__ import annotations

import os
import sys
from contextlib import redirect_stdout
from pathlib import Path
from typing import Any, Dict, Optional

from mcp.server.fastmcp import FastMCP

from agentic_pitch_coach import (
    DEFAULT_CONF_SEGMENT_SEC,
    DEFAULT_FRAME_EVERY_SEC,
    DEFAULT_OPENAI_BASE_URL,
    DEFAULT_OPENAI_MODEL,
    DEFAULT_VOICE_EMOTION_MODEL,
    DEFAULT_WHISPER_SIZE,
    AgenticPitchCoach,
    PitchCoachConfig,
    save_json,
    save_markdown,
    save_pdf_from_markdown,
    validate_runtime_requirements,
)


mcp = FastMCP("agentic-pitch-coach")


def _save_report_outputs(report_obj: Dict[str, Any], config: PitchCoachConfig) -> Dict[str, Any]:
    report_json_path = config.report_dir / "agentic_pitch_coach_full_report.json"
    scorecard_json_path = config.report_dir / "agentic_pitch_coach_scorecard.json"
    markdown_path = config.report_dir / "agentic_pitch_coach_report.md"
    pdf_path = config.report_dir / "agentic_pitch_coach_report.pdf"

    save_json(report_obj, report_json_path)
    save_json(report_obj.get("scorecard", {}), scorecard_json_path)
    save_markdown(report_obj, markdown_path)
    markdown_text = report_obj.get("final_report", {}).get("markdown_report", "")
    pdf_ok = save_pdf_from_markdown(markdown_text, pdf_path)

    return {
        "full_report_json": str(report_json_path),
        "scorecard_json": str(scorecard_json_path),
        "markdown_report": str(markdown_path),
        "pdf_report": str(pdf_path) if pdf_ok else None,
        "pdf_generated": pdf_ok,
    }


def _report_summary(report_obj: Dict[str, Any], output_files: Dict[str, Any]) -> Dict[str, Any]:
    final_report = report_obj.get("final_report", {})
    scorecard = report_obj.get("scorecard", {})
    judge = report_obj.get("judge_result", {})
    next_action = final_report.get("next_best_action", {})

    return {
        "title": final_report.get("title", "Pitch Coaching Report"),
        "overall_score": scorecard.get("overall_score"),
        "overall_status": scorecard.get("overall_status"),
        "next_best_action": next_action,
        "judge_quality_score": judge.get("quality_score"),
        "judge_approved": judge.get("approved"),
        "runtime_warnings": report_obj.get("runtime_warnings", []),
        "output_files": output_files,
    }


@mcp.tool()
def pitch_coach_defaults() -> Dict[str, Any]:
    """Return the default model, output, and analysis settings used by the pitch coach."""
    return {
        "openai_base_url": os.getenv("OPENAI_BASE_URL", DEFAULT_OPENAI_BASE_URL),
        "openai_model": os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL),
        "whisper_size": DEFAULT_WHISPER_SIZE,
        "frame_every_sec": DEFAULT_FRAME_EVERY_SEC,
        "confidence_segment_sec": DEFAULT_CONF_SEGMENT_SEC,
        "voice_emotion_model": DEFAULT_VOICE_EMOTION_MODEL,
        "default_output_dir": "pitch_coach_output",
        "coaching_modes": ["investor", "sales", "demo_day", "class_presentation", "founder_story"],
    }


@mcp.tool()
def analyze_pitch_video(
    video_path: str,
    output_dir: str = "pitch_coach_output",
    openai_base_url: Optional[str] = None,
    openai_model: Optional[str] = None,
    openai_api_key: Optional[str] = None,
    whisper_size: str = DEFAULT_WHISPER_SIZE,
    frame_every_sec: float = DEFAULT_FRAME_EVERY_SEC,
    confidence_segment_sec: float = DEFAULT_CONF_SEGMENT_SEC,
    voice_emotion_model: str = DEFAULT_VOICE_EMOTION_MODEL,
    skip_voice_emotion: bool = False,
    skip_visual: bool = False,
    max_frames: Optional[int] = None,
    max_agent_steps: int = 20,
    judge_revision_rounds: int = 2,
    coaching_mode: str = "investor",
) -> Dict[str, Any]:
    """
    Analyze a local pitch video and save JSON, Markdown, and optional PDF reports.

    Use skip_visual and skip_voice_emotion for faster or lighter runs.
    """
    allowed_whisper_sizes = {"tiny", "base", "small", "medium", "large-v3"}
    allowed_modes = {"investor", "sales", "demo_day", "class_presentation", "founder_story"}

    if whisper_size not in allowed_whisper_sizes:
        raise ValueError(f"whisper_size must be one of: {sorted(allowed_whisper_sizes)}")
    if coaching_mode not in allowed_modes:
        raise ValueError(f"coaching_mode must be one of: {sorted(allowed_modes)}")

    config = PitchCoachConfig(
        video_path=str(Path(video_path).expanduser()),
        output_dir=str(Path(output_dir).expanduser()),
        openai_base_url=openai_base_url or os.getenv("OPENAI_BASE_URL", DEFAULT_OPENAI_BASE_URL),
        openai_model=openai_model or os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL),
        openai_api_key=openai_api_key or os.getenv("OPENAI_API_KEY"),
        whisper_size=whisper_size,
        frame_every_sec=frame_every_sec,
        confidence_segment_sec=confidence_segment_sec,
        voice_emotion_model=voice_emotion_model,
        skip_voice_emotion=skip_voice_emotion,
        skip_visual=skip_visual,
        disable_llm=False,
        max_frames=max_frames,
        max_agent_steps=max_agent_steps,
        judge_revision_rounds=judge_revision_rounds,
        coaching_mode=coaching_mode,
    )

    with redirect_stdout(sys.stderr):
        validate_runtime_requirements(config)
        report_obj = AgenticPitchCoach(config).run()
        output_files = _save_report_outputs(report_obj, config)

    return _report_summary(report_obj, output_files)


if __name__ == "__main__":
    mcp.run(transport="stdio")
