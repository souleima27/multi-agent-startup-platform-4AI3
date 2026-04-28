# Agentic Pitch Coach

Agentic Pitch Coach is a local Python tool that analyzes a pitch video and produces coaching feedback from the transcript, delivery signals, optional visual cues, optional voice-assurance cues, and an OpenAI-compatible chat-completions model.

The main entry point is:

```text
agentic_pitch_coach.py
```

## What It Does

- Extracts audio from a local video file.
- Transcribes the pitch with `faster-whisper`.
- Scores delivery basics such as pace, filler words, energy, and sentence length.
- Uses an OpenAI-compatible LLM for content, narrative, rewrite, strategy, report writing, and report judging.
- Optionally samples video frames and analyzes face/pose/framing cues with OpenCV and MediaPipe.
- Optionally builds a vocal assurance timeline with a Hugging Face audio-classification model.
- Saves JSON, Markdown, and PDF reports.

## Requirements

- Python 3.10 is recommended.
- A local pitch video file, such as `.mp4`, `.mov`, or `.mkv`.
- An OpenAI-compatible chat-completions endpoint.
- Enough disk space for local model downloads. Whisper and the optional voice-emotion model may download model weights on first run.

Install the Python packages with:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements_pitch_coach.txt
```

On macOS or Linux:

```bash
python3.10 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements_pitch_coach.txt
```

## API Configuration

Set these environment variables before running the coach:

```powershell
$env:OPENAI_API_KEY = "your_api_key"
$env:OPENAI_BASE_URL = "https://tokenfactory.esprit.tn/api"
$env:OPENAI_MODEL = "hosted_vllm/Llama-3.1-70B-Instruct"
```

On macOS or Linux:

```bash
export OPENAI_API_KEY="your_api_key"
export OPENAI_BASE_URL="https://tokenfactory.esprit.tn/api"
export OPENAI_MODEL="hosted_vllm/Llama-3.1-70B-Instruct"
```

You can also pass these values through CLI flags:

```powershell
python .\agentic_pitch_coach.py --video .\my_pitch.mp4 --openai-api-key "your_api_key"
```

## Full Analysis

Run all enabled analysis stages:

```powershell
python .\agentic_pitch_coach.py --video .\my_pitch.mp4 --output .\pitch_coach_output
```

The full run performs transcript, audio, content, narrative, visual, voice-assurance, rewrite, and report stages unless you skip optional modalities.

## Faster Test Run

Use a smaller Whisper model, limit sampled frames, and skip the heaviest voice-emotion model:

```powershell
python .\agentic_pitch_coach.py `
  --video .\my_pitch.mp4 `
  --output .\pitch_coach_output `
  --whisper-size tiny `
  --max-frames 30 `
  --skip-voice-emotion
```

## Skip Optional Modalities

Skip visual analysis:

```powershell
python .\agentic_pitch_coach.py --video .\my_pitch.mp4 --skip-visual
```

Skip voice-emotion analysis:

```powershell
python .\agentic_pitch_coach.py --video .\my_pitch.mp4 --skip-voice-emotion
```

Skip both for the lightest run:

```powershell
python .\agentic_pitch_coach.py --video .\my_pitch.mp4 --skip-visual --skip-voice-emotion
```

## MCP Server

This project also includes an MCP stdio server:

```text
mcp_pitch_coach_server.py
```

It exposes these MCP tools:

- `pitch_coach_defaults`: returns the default model and analysis settings.
- `analyze_pitch_video`: runs the pitch coach on a local video and returns a summary plus output file paths.

Run the MCP server manually with:

```powershell
python .\mcp_pitch_coach_server.py
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "agentic-pitch-coach": {
      "command": "python",
      "args": ["C:\\Users\\asus\\Desktop\\pitch\\mcp_pitch_coach_server.py"],
      "env": {
        "OPENAI_API_KEY": "your_api_key",
        "OPENAI_BASE_URL": "https://tokenfactory.esprit.tn/api",
        "OPENAI_MODEL": "hosted_vllm/Llama-3.1-70B-Instruct"
      }
    }
  }
}
```

The MCP server uses stdout for the protocol. Pitch-coach progress logs are redirected to stderr so they do not corrupt the MCP transport.

## Important CLI Options

| Option | Default | Description |
| --- | --- | --- |
| `--video` | Required | Path to the local pitch video. |
| `--output` | `pitch_coach_output` | Directory where generated files are saved. |
| `--openai-base-url` | `OPENAI_BASE_URL` or built-in default | OpenAI-compatible API base URL. |
| `--openai-model` | `OPENAI_MODEL` or built-in default | Chat-completions model name. |
| `--openai-api-key` | `OPENAI_API_KEY` | API key for the configured endpoint. |
| `--whisper-size` | `medium` | One of `tiny`, `base`, `small`, `medium`, or `large-v3`. |
| `--frame-every-sec` | `1.0` | Seconds between sampled video frames. |
| `--confidence-segment-sec` | `5.0` | Segment size for visual and voice assurance timelines. |
| `--voice-emotion-model` | `ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition` | Hugging Face model used for voice assurance. |
| `--skip-voice-emotion` | Off | Disables the voice-assurance model. |
| `--skip-visual` | Off | Disables frame sampling and MediaPipe visual analysis. |
| `--max-frames` | No limit | Limits sampled frames for faster tests. |
| `--max-agent-steps` | `20` | Maximum evidence-gathering tool steps. |
| `--judge-revision-rounds` | `2` | Maximum report judge/revision rounds. |
| `--coaching-mode` | `investor` | One of `investor`, `sales`, `demo_day`, `class_presentation`, or `founder_story`. |

Do not use `--disable-llm`; this completed agentic version requires the LLM.

## Output Files

Reports are saved under:

```text
pitch_coach_output/reports/
```

Expected files:

```text
agentic_pitch_coach_full_report.json
agentic_pitch_coach_scorecard.json
agentic_pitch_coach_report.md
agentic_pitch_coach_report.pdf
```

The PDF file is generated when `reportlab` is installed. The JSON and Markdown files are always written when the run completes successfully.

## Troubleshooting

- Missing dependency: run `python -m pip install -r requirements_pitch_coach.txt` inside the active virtual environment.
- Slow first run: Whisper and Hugging Face models may download weights the first time they are used.
- Visual dependency issues: use `--skip-visual` to run without OpenCV and MediaPipe.
- Voice model issues: use `--skip-voice-emotion` to run without the Hugging Face audio-classification model.
- API errors: check `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL`.
- No PDF: install requirements again or run `python -m pip install reportlab`.
