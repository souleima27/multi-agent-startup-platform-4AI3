from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field


LegalForm = Literal["SUARL", "SARL", "SA"]


class StartupAssociate(BaseModel):
    name: str
    role: str
    equity_pct: float | None = None
    active: bool = True


class StartupProfile(BaseModel):
    startup_name: str = "Unnamed Startup"
    sector: str
    activity_description: str = ""
    founders_count: int = 1
    funding_need_tnd: float = 0.0
    wants_investors: bool = False
    needs_limited_liability: bool = True
    has_foreign_investors: bool = False
    innovative: bool = True
    scalable: bool = True
    uses_technology: bool = True
    associates: list[StartupAssociate] = []


class LegalClassificationResult(BaseModel):
    recommended_legal_form: LegalForm
    sector_classification: str
    regulatory_notes: list[str]
    startup_act_eligibility_score: float = Field(ge=0, le=100)
    rationale: list[str]


class DocumentItem(BaseModel):
    path: str
    declared_type: str | None = None


class DocumentVerificationItemResult(BaseModel):
    file_name: str
    document_type: str
    signature_present: bool
    stamp_present: bool
    quality: Literal["good", "blurred", "unreadable"]
    completeness_score: float = Field(ge=0, le=100)
    issues: list[str]
    is_valid: bool
    extracted_text_preview: str = ""
    ground_truth: dict[str, Any] | None = None


class DocumentVerificationResult(BaseModel):
    documents: list[DocumentVerificationItemResult]
    overall_completeness_score: float = Field(ge=0, le=100)
    cross_document_issues: list[str]


class WorkflowStep(BaseModel):
    step_no: int
    title: str
    institution: str
    estimated_delay_days: int
    depends_on: list[int] = []
    deliverables: list[str] = []


class AdministrativeWorkflowResult(BaseModel):
    legal_form: LegalForm
    institutions: list[str]
    total_estimated_days: int
    checklist: list[WorkflowStep]
    notes: list[str]


class StartupLabelSimulationInput(BaseModel):
    startup_name: str = "Unnamed Startup"
    transcript: str = ""
    slide_text: str = ""
    sector: str = ""
    traction_signals: list[str] = []
    team_signals: list[str] = []
    pitch_video_path: str | None = None
    pitch_notes: list[str] = []


class StartupLabelSimulationResult(BaseModel):
    innovation_score: float = Field(ge=0, le=100)
    scalability_score: float = Field(ge=0, le=100)
    tech_intensity_score: float = Field(ge=0, le=100)
    storytelling_score: float = Field(ge=0, le=100)
    approval_probability: float = Field(ge=0, le=100)
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]


class IntelligentAction(BaseModel):
    action: str
    status: Literal["planned", "applied", "suggested"]
    details: str


class DiagnosticCheck(BaseModel):
    name: str
    status: Literal["pass", "warning", "fail"]
    severity: Literal["low", "medium", "high", "critical"]
    details: str


class DocumentDiagnostic(BaseModel):
    summary: str
    risk_level: Literal["low", "medium", "high", "critical"]
    legal_blocker: bool
    checks: list[DiagnosticCheck]
    probable_causes: list[str]
    business_impact: str
    recommended_actions: list[str]
    priority_score: float = Field(ge=0, le=100)


class AgentQuestionAnswer(BaseModel):
    question: str
    answer: str
    confidence: Literal["low", "medium", "high"]
    evidence: list[str] = []


class AgentDocumentAction(BaseModel):
    file_name: str
    action_type: str
    status: Literal["planned", "applied", "suggested", "failed"]
    details: str
    artifact_path: str | None = None


class CrossDocumentValidationItem(BaseModel):
    check: str
    status: Literal["pass", "warning", "fail"]
    details: str
    impacted_documents: list[str] = []


class StrategicAssessmentResult(BaseModel):
    recommended_legal_form: LegalForm
    startup_act_eligibility_score: float = Field(ge=0, le=100)
    startup_label_probability: float = Field(ge=0, le=100)
    startup_label_multimodal: StartupLabelSimulationResult
    sector_classification: str = ""
    founders_structure: str = ""
    funding_analysis: str = ""
    regulatory_compatibility: str = "compatible"
    required_documents: list[str] = []
    pitch_score: float = Field(ge=0, le=100, default=0.0)
    pitch_summary: str = ""
    pitch_strengths: list[str] = []
    pitch_weaknesses: list[str] = []
    pitch_recommendations: list[str] = []
    associate_structure_summary: str = ""
    associate_roles: list[str] = []
    associate_recommendations: list[str] = []
    institutions: list[str]
    checklist: list[WorkflowStep]
    rationale: list[str]
    reasoning_trace: list[str]
    actions: list[IntelligentAction]


class DocumentOpsItemResult(BaseModel):
    file_name: str
    document_type: str
    source_format: Literal["image", "pdf", "docx", "pptx", "other"] = "image"
    signature_present: bool | None
    stamp_present: bool | None
    quality: Literal["good", "blurred", "unreadable", "n_a"]
    completeness_score: float = Field(ge=0, le=100)
    issues: list[str]
    extracted_text_preview: str = ""
    suggested_fix: str = ""
    corrected_declared_type: str | None = None
    auto_correction_applied: bool = False
    diagnostic: DocumentDiagnostic | None = None


class DocumentOpsResult(BaseModel):
    documents: list[DocumentOpsItemResult]
    overall_completeness_score: float = Field(ge=0, le=100)
    missing_documents: list[str]
    cross_document_issues: list[str]
    cross_document_validations: list[CrossDocumentValidationItem] = []
    categorized_documents: dict[str, list[str]]
    version_tracking: dict[str, str]
    suggested_folders: list[str]
    reasoning_trace: list[str]
    actions: list[IntelligentAction]
    document_actions: list[AgentDocumentAction] = []
    question_answers: list[AgentQuestionAnswer] = []
    global_risk_score: float = Field(ge=0, le=100, default=0.0)
    global_priority_action: str = ""
    strict_fail: bool = False
    strict_violations: list[str] = []


class TrackBRunOptions(BaseModel):
    strict_mode: bool = False
    generate_json_report: bool = True
    generate_pdf_report: bool = True
    report_prefix: str = "track_b_report"


class TrackBRequest(BaseModel):
    startup_profile: StartupProfile
    documents: list[DocumentItem] = []
    label_input: StartupLabelSimulationInput | None = None
    options: TrackBRunOptions = TrackBRunOptions()


class TrackBResponse(BaseModel):
    strategic_agent: StrategicAssessmentResult
    document_agent: DocumentOpsResult
    final_output: dict[str, Any]


class RunCaseResponse(BaseModel):
    recommended_legal_structure: str
    startup_act_score: float = Field(ge=0, le=100)
    missing_documents: list[str]
    document_completeness_score: float = Field(ge=0, le=100)
    signature_stamp_validation: dict[str, Any]
    administrative_checklist: list[dict[str, Any]]
    deadlines: list[dict[str, Any]]
    dependencies: list[dict[str, Any]]
    final_decision: Literal["PASS", "WARNING", "FAIL"]
    details: dict[str, Any] = {}


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    confidence: Literal["low", "medium", "high"]
    suggested_actions: list[str] = []
    correction_artifacts: dict[str, str] = {}
    context_available: bool = False
