from __future__ import annotations

from app.models.schemas import AdministrativeWorkflowResult, WorkflowStep
from app.services.knowledge_base import KnowledgeBase


class AdministrativeWorkflowAgent:
    name = "B3_AdministrativeWorkflowAgent"

    def run(self, legal_form: str, kb: KnowledgeBase | None = None) -> AdministrativeWorkflowResult:
        steps = [
            WorkflowStep(step_no=1, title="Reserve company name", institution="RNE", estimated_delay_days=2, deliverables=["Name reservation receipt"]),
            WorkflowStep(step_no=2, title="Draft and sign statutes", institution="Lawyer / Founders", estimated_delay_days=3, depends_on=[1], deliverables=["Signed statutes"]),
            WorkflowStep(step_no=3, title="Open blocked bank account and deposit capital", institution="Bank", estimated_delay_days=3, depends_on=[2], deliverables=["Bank certificate"]),
            WorkflowStep(step_no=4, title="Register company", institution="RNE", estimated_delay_days=5, depends_on=[2, 3], deliverables=["Registration certificate"]),
            WorkflowStep(step_no=5, title="Obtain tax identification", institution="Tax Office", estimated_delay_days=4, depends_on=[4], deliverables=["Tax card / IF"]),
            WorkflowStep(step_no=6, title="CNSS declaration if needed", institution="CNSS", estimated_delay_days=4, depends_on=[4], deliverables=["CNSS registration"]),
            WorkflowStep(step_no=7, title="Prepare Startup Label application", institution="Startup Tunisia", estimated_delay_days=7, depends_on=[4, 5], deliverables=["Pitch deck", "Innovation proof", "Application form"]),
        ]

        notes = [
            f"Selected legal form: {legal_form}",
            "Actual timelines can vary by governorate, sector, and document quality.",
            "Regulated sectors may require extra authorizations.",
        ]
        if kb is not None:
            references = kb.find_evidence(["registre national des entreprises", "cnss", "identification fiscale"], limit=2)
            if references:
                notes.append("Workflow steps were cross-checked against knowledge-base regulatory snippets.")
        institutions = sorted({s.institution for s in steps})
        total_days = sum(s.estimated_delay_days for s in steps)
        return AdministrativeWorkflowResult(
            legal_form=legal_form,  # type: ignore[arg-type]
            institutions=institutions,
            total_estimated_days=total_days,
            checklist=steps,
            notes=notes,
        )
