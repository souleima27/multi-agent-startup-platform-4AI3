from __future__ import annotations

from app.models.schemas import StartupProfile, LegalClassificationResult
from app.services.knowledge_base import KnowledgeBase


class LegalClassificationAgent:
    name = "B1_LegalClassificationAgent"

    def run(self, profile: StartupProfile, kb: KnowledgeBase | None = None) -> LegalClassificationResult:
        sector = profile.sector.lower()
        rationale: list[str] = []
        notes: list[str] = []

        if profile.founders_count == 1 and not profile.wants_investors:
            legal_form = "SUARL"
            rationale.append("Single founder without immediate investor requirement.")
        elif profile.wants_investors or profile.funding_need_tnd >= 500000 or profile.has_foreign_investors:
            legal_form = "SA"
            rationale.append("Investor readiness and larger capital needs favor SA.")
        else:
            legal_form = "SARL"
            rationale.append("Balanced structure for multi-founder startups with limited liability.")

        if any(k in sector for k in ["fintech", "health", "med", "insurance"]):
            notes.append("Regulated sector: additional approvals may be required.")
        if any(k in sector for k in ["ai", "software", "saas", "deeptech", "robot"]):
            notes.append("High technology profile strengthens Startup Act positioning.")
        if profile.needs_limited_liability:
            rationale.append("Limited liability requirement is satisfied.")

        if kb is not None:
            legal_form_keywords = {
                "SUARL": ["unipersonnelle", "responsabilite limitee"],
                "SARL": ["societe a responsabilite limitee", "sarl", "statuts"],
                "SA": ["societe anonyme", "sa", "investisseur"],
            }
            snippets = kb.find_evidence(legal_form_keywords.get(legal_form, []), limit=1)
            if snippets:
                rationale.append("Knowledge base evidence consulted for legal-form alignment.")
            if any("registre" in s.lower() for s in snippets):
                notes.append("Knowledge base indicates RNE/registry documentation is central for this legal form.")

        eligibility_score = 40.0
        if profile.innovative:
            eligibility_score += 20
        if profile.scalable:
            eligibility_score += 20
        if profile.uses_technology:
            eligibility_score += 20
        eligibility_score = min(100.0, eligibility_score)

        return LegalClassificationResult(
            recommended_legal_form=legal_form,  # type: ignore[arg-type]
            sector_classification=profile.sector,
            regulatory_notes=notes,
            startup_act_eligibility_score=eligibility_score,
            rationale=rationale,
        )
