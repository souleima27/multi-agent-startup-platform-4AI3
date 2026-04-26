from __future__ import annotations

from app.models.schemas import (
    IntelligentAction,
    StartupLabelSimulationInput,
    StartupLabelSimulationResult,
    StartupProfile,
    StrategicAssessmentResult,
    WorkflowStep,
)
from app.services.knowledge_base import KnowledgeBase
from app.services.local_llm import LocalLLMClient


class StrategicLegalAgent:
    name = "A1_StrategicLegalAgent"

    def __init__(self, llm: LocalLLMClient) -> None:
        self.llm = llm

    def _build_workflow(self) -> list[WorkflowStep]:
        return [
            WorkflowStep(step_no=1, title="Reserve company name", institution="RNE", estimated_delay_days=2, deliverables=["Name reservation receipt"]),
            WorkflowStep(step_no=2, title="Draft and sign statutes", institution="Lawyer / Founders", estimated_delay_days=3, depends_on=[1], deliverables=["Signed statutes"]),
            WorkflowStep(step_no=3, title="Open blocked bank account and deposit capital", institution="Bank", estimated_delay_days=3, depends_on=[2], deliverables=["Bank certificate"]),
            WorkflowStep(step_no=4, title="Register company", institution="RNE", estimated_delay_days=5, depends_on=[2, 3], deliverables=["Registration certificate"]),
            WorkflowStep(step_no=5, title="Obtain tax identification", institution="Tax Office", estimated_delay_days=4, depends_on=[4], deliverables=["Tax card / IF"]),
            WorkflowStep(step_no=6, title="CNSS declaration if needed", institution="CNSS", estimated_delay_days=4, depends_on=[4], deliverables=["CNSS registration"]),
            WorkflowStep(step_no=7, title="Prepare Startup Label application", institution="Startup Tunisia", estimated_delay_days=7, depends_on=[4, 5], deliverables=["Pitch deck", "Innovation proof", "Application form"]),
        ]

    def _heuristic_legal_form(self, profile: StartupProfile) -> str:
        founders_count = len(profile.associates) if profile.associates else profile.founders_count
        if founders_count == 1 and not profile.wants_investors:
            return "SUARL"
        if profile.wants_investors or profile.funding_need_tnd >= 500000 or profile.has_foreign_investors:
            return "SA"
        return "SARL"

    def _associate_structure_summary(self, profile: StartupProfile) -> tuple[str, list[str], list[str]]:
        associates = profile.associates or []
        if not associates:
            return (
                "Aucune structure d'associés détaillée fournie; le système s'appuie sur founders_count.",
                [],
                ["Ajouter les noms, roles et pourcentages de participation des associés pour un diagnostic plus fin."],
            )

        roles = [f"{associate.name}: {associate.role}" for associate in associates]
        missing_fields: list[str] = []
        if any(not associate.role.strip() for associate in associates):
            missing_fields.append("role")
        if any(associate.equity_pct is None for associate in associates):
            missing_fields.append("equity_pct")

        equity_total = sum(associate.equity_pct or 0.0 for associate in associates)
        summary_parts = [
            f"{len(associates)} associe(s) renseigné(s)",
            f"roles: {', '.join(roles)}",
        ]
        if equity_total > 0:
            summary_parts.append(f"equity_totale: {equity_total:.1f}%")

        recommendations = []
        if missing_fields:
            recommendations.append("Completer les champs manquants des associés: " + ", ".join(sorted(set(missing_fields))) + ".")
        if equity_total and abs(equity_total - 100.0) > 0.5:
            recommendations.append("Verifier la repartition du capital pour qu'elle soit coherente et documentee.")
        if not recommendations:
            recommendations.append("La structure des associés est suffisamment détaillée pour l'analyse initiale.")

        return "; ".join(summary_parts) + ".", roles, recommendations

    def _build_pitch_assessment(self, profile: StartupProfile, label_input: StartupLabelSimulationInput | None) -> tuple[float, str, list[str], list[str], list[str]]:
        transcript = label_input.transcript if label_input else ""
        slide_text = label_input.slide_text if label_input else ""
        notes = label_input.pitch_notes if label_input else []

        text_blob = " ".join([profile.activity_description, profile.sector, transcript, slide_text, " ".join(notes)]).lower()

        structure_score = 40.0
        if transcript.strip():
            structure_score += 20
        if slide_text.strip():
            structure_score += 15
        if len(transcript.split()) >= 80:
            structure_score += 10
        if len(notes) >= 2:
            structure_score += 5

        strengths: list[str] = []
        weaknesses: list[str] = []
        recommendations: list[str] = []

        if any(word in text_blob for word in ["problem", "solution", "market", "traction"]):
            strengths.append("Le pitch suit une logique problem-solution-marché convaincante.")
            structure_score += 10
        else:
            weaknesses.append("Le pitch manque d'une structure problem-solution-marché explicite.")
            recommendations.append("Introduire clairement le problème, la solution, la preuve et le marché.")

        if any(word in text_blob for word in ["demo", "prototype", "pilot", "clients", "revenu", "traction"]):
            strengths.append("Le pitch apporte des indices de preuve concrète.")
            structure_score += 10
        else:
            weaknesses.append("Le pitch manque de preuves concrètes ou de traction mesurable.")
            recommendations.append("Ajouter des chiffres, un prototype ou des retours clients.")

        if len(slide_text.split()) < 40:
            weaknesses.append("Les slides semblent trop légères pour une soutenance solide.")
            recommendations.append("Renforcer les slides avec chiffres, bénéfices et différenciation.")

        if not strengths:
            strengths.append("Le pitch transmet une intention entrepreneuriale claire.")
        if not recommendations:
            recommendations.append("Rendre la narration plus directe et plus factuelle.")

        pitch_score = max(0.0, min(100.0, round(structure_score, 2)))
        summary = (
            "Pitch exploitable sans vidéo obligatoire: transcript et slides suffisent pour l'analyse. "
            if not (label_input and label_input.pitch_video_path)
            else "Pitch exploitable avec support vidéo en complément du transcript et des slides. "
        )
        return pitch_score, summary, strengths, weaknesses, recommendations

    def _infer_required_documents(self, legal_form: str, profile: StartupProfile) -> list[str]:
        required = ["cin", "statuts", "attestation_bancaire", "rc", "if"]
        if profile.founders_count > 1 or profile.associates:
            required.append("declaration_beneficiaire_effectif")
        if legal_form == "SA":
            required.append("pacte_actionnaires")
        return sorted(set(required))

    def _build_regulatory_compatibility(self, profile: StartupProfile, legal_form: str) -> str:
        if legal_form == "SUARL" and (profile.wants_investors or profile.has_foreign_investors):
            return "warning: SUARL may be less suitable for investor-heavy structure"
        if legal_form == "SA" and profile.funding_need_tnd < 120000 and not profile.wants_investors:
            return "warning: SA may be heavier than required for current funding profile"
        return "compatible"

    def _heuristic_eligibility(self, profile: StartupProfile) -> float:
        score = 40.0
        if profile.innovative:
            score += 20
        if profile.scalable:
            score += 20
        if profile.uses_technology:
            score += 20
        return min(100.0, score)

    def _heuristic_label_probability(self, profile: StartupProfile, label_input: StartupLabelSimulationInput | None) -> float:
        text_blob = f"{profile.activity_description} {profile.sector}"
        if label_input is not None:
            text_blob += f" {label_input.transcript} {label_input.slide_text}"
        lowered = text_blob.lower()

        score = 45.0
        if any(k in lowered for k in ["ai", "automation", "innovation", "deeptech"]):
            score += 20
        if any(k in lowered for k in ["saas", "scale", "b2b", "subscription", "growth"]):
            score += 20
        if any(k in lowered for k in ["traction", "pilot", "market"]):
            score += 10
        return round(min(100.0, score), 2)

    def _build_multimodal_label_assessment(
        self,
        profile: StartupProfile,
        label_input: StartupLabelSimulationInput | None,
        kb: KnowledgeBase,
    ) -> StartupLabelSimulationResult:
        transcript = label_input.transcript if label_input else ""
        slide_text = label_input.slide_text if label_input else ""
        traction = label_input.traction_signals if label_input else []
        team = label_input.team_signals if label_input else []

        text_blob = " ".join(
            [
                profile.activity_description,
                profile.sector,
                transcript,
                slide_text,
                " ".join(traction),
                " ".join(team),
            ]
        ).lower()

        innovation = 50.0
        scalability = 45.0
        tech = 45.0
        storytelling = 40.0

        if profile.innovative:
            innovation += 20
        if profile.scalable:
            scalability += 20
        if profile.uses_technology:
            tech += 20
        if transcript.strip():
            storytelling += 15

        if any(k in text_blob for k in ["ai", "deeptech", "innovation", "patent"]):
            innovation += 10
            tech += 10
        if any(k in text_blob for k in ["saas", "b2b", "subscription", "platform"]):
            scalability += 10
        if any(k in text_blob for k in ["pilot", "traction", "clients", "market"]):
            storytelling += 10
            scalability += 5

        if len(traction) >= 2:
            storytelling += 8
        if len(team) >= 2:
            tech += 5
            scalability += 5

        innovation = max(0.0, min(100.0, round(innovation, 2)))
        scalability = max(0.0, min(100.0, round(scalability, 2)))
        tech = max(0.0, min(100.0, round(tech, 2)))
        storytelling = max(0.0, min(100.0, round(storytelling, 2)))
        approval = round((innovation * 0.3) + (scalability * 0.3) + (tech * 0.2) + (storytelling * 0.2), 2)

        kb_evidence = kb.find_evidence(["startup", "innovation", "label", "traction"], limit=3)
        prompt = f"""
        You are evaluating a startup label application in Tunisia.
        Return ONLY JSON with keys:
        innovation_score, scalability_score, tech_intensity_score, storytelling_score,
        approval_probability, strengths (array), weaknesses (array), recommendations (array).

        Inputs:
        - sector: {profile.sector}
        - activity: {profile.activity_description}
        - transcript: {transcript}
        - slide_text: {slide_text}
        - traction_signals: {traction}
        - team_signals: {team}
        - baseline_scores: innovation={innovation}, scalability={scalability}, tech={tech}, storytelling={storytelling}, approval={approval}
        - kb_snippets: {kb_evidence}
        """

        fallback = {
            "innovation_score": innovation,
            "scalability_score": scalability,
            "tech_intensity_score": tech,
            "storytelling_score": storytelling,
            "approval_probability": approval,
            "strengths": [
                "Innovation and technology profile are promising.",
                "Startup positioning aligns with scalable model indicators.",
            ],
            "weaknesses": [
                "Strengthen evidence of traction and quantified milestones.",
            ],
            "recommendations": [
                "Provide concrete traction metrics and customer proof.",
                "Refine pitch narrative with problem-solution-proof sequence.",
            ],
        }

        llm_json = self.llm.complete_json(
            prompt=prompt,
            system="Return strict JSON only. Keep evaluation actionable and realistic.",
            fallback=fallback,
        )

        return StartupLabelSimulationResult(
            innovation_score=max(0.0, min(100.0, float(llm_json.get("innovation_score", innovation)))),
            scalability_score=max(0.0, min(100.0, float(llm_json.get("scalability_score", scalability)))),
            tech_intensity_score=max(0.0, min(100.0, float(llm_json.get("tech_intensity_score", tech)))),
            storytelling_score=max(0.0, min(100.0, float(llm_json.get("storytelling_score", storytelling)))),
            approval_probability=max(0.0, min(100.0, float(llm_json.get("approval_probability", approval)))),
            strengths=[str(x) for x in llm_json.get("strengths", fallback["strengths"])],
            weaknesses=[str(x) for x in llm_json.get("weaknesses", fallback["weaknesses"])],
            recommendations=[str(x) for x in llm_json.get("recommendations", fallback["recommendations"])],
        )

    def run(self, payload: dict, kb: KnowledgeBase) -> StrategicAssessmentResult:
        profile: StartupProfile = payload["startup_profile"]
        label_input: StartupLabelSimulationInput | None = payload.get("label_input")

        workflow = self._build_workflow()
        legal_form = self._heuristic_legal_form(profile)
        eligibility = self._heuristic_eligibility(profile)
        label_probability = self._heuristic_label_probability(profile, label_input)
        multimodal_assessment = self._build_multimodal_label_assessment(profile, label_input, kb)
        institutions = sorted({step.institution for step in workflow})
        associate_summary, associate_roles, associate_recommendations = self._associate_structure_summary(profile)
        pitch_score, pitch_summary, pitch_strengths, pitch_weaknesses, pitch_recommendations = self._build_pitch_assessment(profile, label_input)

        evidence = kb.find_evidence(["registre", "statuts", "startup", "innovation"], limit=2)
        prompt = f"""
        You are a legal and startup strategy expert for Tunisia.
        Return ONLY JSON with keys:
        legal_form, startup_act_score, startup_label_probability, rationale (array of strings), reasoning_trace (array of short strings).

        Startup profile:
        - name: {profile.startup_name}
        - sector: {profile.sector}
        - activity: {profile.activity_description}
        - founders_count: {profile.founders_count}
        - funding_need_tnd: {profile.funding_need_tnd}
        - wants_investors: {profile.wants_investors}
        - has_foreign_investors: {profile.has_foreign_investors}
        - associates_structure: {associate_summary}
        - innovative: {profile.innovative}
        - scalable: {profile.scalable}
        - uses_technology: {profile.uses_technology}

        Baseline recommendation: {legal_form}
        Baseline startup act score: {eligibility}
        Baseline label probability: {label_probability}
        KB snippets: {evidence}
        """

        fallback = {
            "legal_form": legal_form,
            "startup_act_score": eligibility,
            "startup_label_probability": label_probability,
            "rationale": [
                "Heuristic legal recommendation based on founders, funding, and investor needs.",
                "Knowledge-base snippets were considered for compliance context.",
            ],
            "reasoning_trace": [
                "Analyze startup profile and financing constraints.",
                "Map profile to legal form constraints.",
                "Estimate Startup Act and label potential.",
            ],
        }
        llm_json = self.llm.complete_json(
            prompt=prompt,
            system="Provide concise strategic legal reasoning and output strict JSON.",
            fallback=fallback,
        )

        decided_legal = str(llm_json.get("legal_form", legal_form))
        if decided_legal not in {"SUARL", "SARL", "SA"}:
            decided_legal = legal_form

        startup_act_score = float(llm_json.get("startup_act_score", eligibility))
        startup_label_probability = float(
            llm_json.get("startup_label_probability", multimodal_assessment.approval_probability or label_probability)
        )
        sector_classification = profile.sector
        founders_structure = associate_summary
        funding_analysis = (
            f"Funding need estimated at {profile.funding_need_tnd:.0f} TND; "
            + ("investors targeted." if profile.wants_investors else "self-funded trajectory preferred.")
        )
        required_documents = self._infer_required_documents(decided_legal, profile)
        regulatory_compatibility = self._build_regulatory_compatibility(profile, decided_legal)
        rationale = [str(x) for x in llm_json.get("rationale", fallback["rationale"])]
        reasoning_trace = [str(x) for x in llm_json.get("reasoning_trace", fallback["reasoning_trace"])]

        actions = [
            IntelligentAction(
                action="Optimize legal form",
                status="applied",
                details=f"Final recommendation set to {decided_legal} after heuristic + LLM reasoning.",
            ),
            IntelligentAction(
                action="Prioritize startup label dossier",
                status="planned",
                details="Checklist includes dedicated startup label preparation with evidence package.",
            ),
        ]

        if profile.associates:
            actions.append(
                IntelligentAction(
                    action="Validate associate structure",
                    status="planned",
                    details="Review associate roles, ownership distribution, and governance completeness.",
                )
            )
        actions.append(
            IntelligentAction(
                action="Assess pitch narrative",
                status="applied",
                details="Pitch quality evaluated from transcript, slide text, and optional pitch notes; video is not required.",
            )
        )

        return StrategicAssessmentResult(
            recommended_legal_form=decided_legal,
            startup_act_eligibility_score=max(0.0, min(100.0, startup_act_score)),
            startup_label_probability=max(0.0, min(100.0, startup_label_probability)),
            startup_label_multimodal=multimodal_assessment,
            sector_classification=sector_classification,
            founders_structure=founders_structure,
            funding_analysis=funding_analysis,
            regulatory_compatibility=regulatory_compatibility,
            required_documents=required_documents,
            pitch_score=pitch_score,
            pitch_summary=pitch_summary,
            pitch_strengths=pitch_strengths,
            pitch_weaknesses=pitch_weaknesses,
            pitch_recommendations=pitch_recommendations,
            associate_structure_summary=associate_summary,
            associate_roles=associate_roles,
            associate_recommendations=associate_recommendations,
            institutions=institutions,
            checklist=workflow,
            rationale=rationale,
            reasoning_trace=reasoning_trace,
            actions=actions,
        )
