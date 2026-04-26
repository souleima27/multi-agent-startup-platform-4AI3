from __future__ import annotations

from pathlib import Path
from typing import Any
import json
import cv2
import numpy as np

try:
    import pytesseract
except Exception:  # pragma: no cover - fallback when OCR dependency is unavailable
    pytesseract = None


def load_image(path: str | Path) -> np.ndarray:
    image = cv2.imread(str(path))
    if image is None:
        raise FileNotFoundError(f"Unable to read image: {path}")
    return image


def detect_blue_signature(image: np.ndarray) -> bool:
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower = np.array([90, 50, 40])
    upper = np.array([140, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    return int(mask.sum()) > 3000


def detect_red_stamp(image: np.ndarray) -> bool:
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower1 = np.array([0, 70, 50])
    upper1 = np.array([10, 255, 255])
    lower2 = np.array([170, 70, 50])
    upper2 = np.array([180, 255, 255])
    mask = cv2.inRange(hsv, lower1, upper1) + cv2.inRange(hsv, lower2, upper2)
    return int(mask.sum()) > 12000


def estimate_quality(image: np.ndarray) -> str:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    score = cv2.Laplacian(gray, cv2.CV_64F).var()
    if score < 8:
        return "unreadable"
    if score < 25:
        return "blurred"
    return "good"


def lightweight_text_extraction(image: np.ndarray) -> str:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    density = float(np.count_nonzero(thresh)) / float(thresh.size)
    return f"visual_text_density={density:.4f}"


def extract_text_with_ocr(image: np.ndarray) -> str:
    """Extract text with OCR when available, otherwise fall back to lightweight metrics."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    processed = cv2.medianBlur(gray, 3)
    _, processed = cv2.threshold(processed, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    if pytesseract is None:
        return lightweight_text_extraction(image)

    try:
        data = pytesseract.image_to_data(processed, output_type=pytesseract.Output.DICT)
        words: list[str] = []
        confidences: list[float] = []

        for text_raw, conf_raw in zip(data.get("text", []), data.get("conf", [])):
            text = str(text_raw).strip()
            if not text:
                continue
            conf = float(conf_raw)
            if conf >= 0:
                words.append(text)
                confidences.append(conf)

        if not words:
            return lightweight_text_extraction(image)

        preview = " ".join(words)
        preview = " ".join(preview.split())[:220]
        avg_conf = round(sum(confidences) / max(1, len(confidences)), 2)
        return f"ocr_conf={avg_conf}; text='{preview}'"
    except Exception:
        return lightweight_text_extraction(image)


def load_ground_truth_if_exists(image_path: str | Path) -> dict[str, Any] | None:
    path = Path(image_path)
    label_path = path.parent.parent / "labels" / f"{path.stem}.json"
    if label_path.exists():
        return json.loads(label_path.read_text(encoding="utf-8"))
    return None
