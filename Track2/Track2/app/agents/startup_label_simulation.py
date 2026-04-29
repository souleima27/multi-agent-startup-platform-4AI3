from __future__ import annotations

from app.models.schemas import StartupLabelSimulationInput, StartupLabelSimulationResult


class StartupLabelSimulationAgent:
    name = "B4_StartupLabelSimulationAgent"

    def _score_keywords(self, text: str, keywords: list[str], base: float = 20.0, gain: float = 10.0) -> float:
        lowered = text.lower()
        count = sum(1 for kw in keywords if kw in lowered)
        return min(100.0, base + count * gain)

    def run(self, payload: StartupLabelSimulationInput) -> StartupLabelSimulationResult:
        combined = f"{payload.transcript} {payload.slide_text} {payload.sector} {' '.join(payload.traction_signals)} {' '.join(payload.team_signals)}"

        innovation = self._score_keywords(combined, ["innovation", "ai", "automation", "novel", "patent", "computer vision", "multimodal"], 30, 8)
        scalability = self._score_keywords(combined, ["saas", "platform", "scale", "b2b", "subscription", "international", "growth"], 25, 10)
        tech_intensity = self._score_keywords(combined, ["ai", "ml", "deep learning", "data", "cloud", "api", "agent", "ocr"], 20, 10)

        storytelling_items = ["problem", "solution", "market", "traction", "team", "business model"]
        storytelling = self._score_keywords(combined, storytelling_items, 20, 12)

        approval_probability = round((innovation * 0.30) + (scalability * 0.25) + (tech_intensity * 0.25) + (storytelling * 0.20), 2)

        strengths = []
        weaknesses = []
        recommendations = []

        if innovation >= 70:
            strengths.append("Strong innovation signal.")
        else:
            weaknesses.append("Innovation message is not explicit enough.")
            recommendations.append("Explain clearly what is technically new compared to alternatives.")

        if scalability >= 70:
            strengths.append("Scalability potential is visible.")
        else:
            weaknesses.append("Scalability proof is limited.")
            recommendations.append("Add target market size, replication model, and growth plan.")

        if storytelling >= 70:
            strengths.append("Pitch narrative is structured.")
        else:
            weaknesses.append("Storytelling is incomplete.")
            recommendations.append("Structure the pitch as problem → solution → market → traction → team.")

        if tech_intensity < 65:
            recommendations.append("Provide stronger technical evidence: architecture, model, IP, or R&D depth.")

        return StartupLabelSimulationResult(
            innovation_score=round(innovation, 2),
            scalability_score=round(scalability, 2),
            tech_intensity_score=round(tech_intensity, 2),
            storytelling_score=round(storytelling, 2),
            approval_probability=approval_probability,
            strengths=strengths,
            weaknesses=weaknesses,
            recommendations=recommendations,
        )
