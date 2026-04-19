# =========================================================
# PDF REPORT GENERATOR FOR EXECUTION AGENT + MCP
# =========================================================

# pip install reportlab

import os
import json
from datetime import datetime
from typing import Any, Dict, List

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    PageBreak,
)
from reportlab.lib import colors


class ExecutionAgentPDFReport:
    """
    Generates a detailed PDF report from the execution agent result.

    Expected input:
    - execution_agent_outputs/execution_result_SkillBridge.json
    """

    def __init__(
        self,
        result: Dict[str, Any],
        output_path: str = "execution_agent_outputs/SkillBridge_Execution_Report.pdf",
    ):
        self.result = result
        self.output_path = output_path

        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        self.doc = SimpleDocTemplate(
            output_path,
            pagesize=landscape(A4),
            rightMargin=0.45 * inch,
            leftMargin=0.45 * inch,
            topMargin=0.45 * inch,
            bottomMargin=0.45 * inch,
        )

        self.styles = getSampleStyleSheet()
        self.story = []

        self.title_style = ParagraphStyle(
            "TitleStyle",
            parent=self.styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#0B3C6D"),
            spaceAfter=10,
        )

        self.meta_style = ParagraphStyle(
            "MetaStyle",
            parent=self.styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#555555"),
            spaceAfter=10,
        )

        self.section_style = ParagraphStyle(
            "SectionStyle",
            parent=self.styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#0B5394"),
            spaceBefore=8,
            spaceAfter=8,
        )

        self.sub_style = ParagraphStyle(
            "SubStyle",
            parent=self.styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            textColor=colors.HexColor("#333333"),
            spaceBefore=5,
            spaceAfter=5,
        )

        self.body_style = ParagraphStyle(
            "BodyStyle",
            parent=self.styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.black,
            spaceAfter=4,
        )

        self.small_style = ParagraphStyle(
            "SmallStyle",
            parent=self.styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=colors.black,
        )

    # =========================================================
    # HELPERS
    # =========================================================

    def _safe(self, value: Any, default: str = "N/A") -> str:
        if value is None:
            return default
        text = str(value).strip()
        return text if text else default

    def _truncate(self, value: Any, max_len: int = 80) -> str:
        text = self._safe(value, "")
        if len(text) <= max_len:
            return text
        return text[: max_len - 3] + "..."

    def _section_title(self, text: str):
        self.story.append(Paragraph(f"<b>{text}</b>", self.section_style))

    def _simple_table(
        self,
        data: List[List[Any]],
        col_widths: List[float],
        header_bg: str = "#0B5394",
        row_bg_1: str = "#FFFFFF",
        row_bg_2: str = "#EEF4FA",
        align: str = "LEFT",
        font_size: int = 8,
    ) -> Table:
        table = Table(data, colWidths=col_widths, repeatRows=1)
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(header_bg)),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), font_size),
                    ("ALIGN", (0, 0), (-1, -1), align),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("LEFTPADDING", (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#B7C9D6")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor(row_bg_1), colors.HexColor(row_bg_2)]),
                ]
            )
        )
        return table

    def _identify_parallel_groups(self, tasks: List[Dict[str, Any]]) -> List[List[Dict[str, Any]]]:
        """
        Group tasks by depth in the dependency chain.
        Tasks with same depth are candidates for parallel execution.
        """
        task_map = {t["id"]: t for t in tasks if "id" in t}
        memo: Dict[str, int] = {}

        def depth(task_id: str) -> int:
            if task_id in memo:
                return memo[task_id]
            task = task_map.get(task_id, {})
            deps = task.get("depends_on", [])
            if not deps:
                memo[task_id] = 0
                return 0
            val = 1 + max((depth(d) for d in deps if d in task_map), default=0)
            memo[task_id] = val
            return val

        levels: Dict[int, List[Dict[str, Any]]] = {}
        for task in tasks:
            if "id" not in task:
                continue
            d = depth(task["id"])
            levels.setdefault(d, []).append(task)

        return [levels[k] for k in sorted(levels.keys()) if levels[k]]

    # =========================================================
    # SECTIONS
    # =========================================================

    def add_cover(self):
        startup = self.result.get("startup_name", "Unknown Startup")
        mode = self.result.get("models", {}).get("mode", "unknown")
        planner_used = self.result.get("models", {}).get("planner_used", "unknown")
        critic_used = self.result.get("models", {}).get("critic_used", "unknown")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        self.story.append(Paragraph(f"PROJECT EXECUTION REPORT<br/>{startup}", self.title_style))
        self.story.append(
            Paragraph(
                f"Generated on {timestamp}<br/>"
                f"Mode: {mode} | Planner: {planner_used} | Critic: {critic_used}",
                self.meta_style,
            )
        )
        self.story.append(Spacer(1, 0.15 * inch))

        state = self.result.get("updated_state", {})
        profile = state.get("startup_profile", {})
        mvp_plan = state.get("mvp_plan", {})

        intro = (
            f"<b>Objective:</b> {self._safe(profile.get('objective'))}<br/><br/>"
            f"<b>Problem Statement:</b> {self._safe(profile.get('problem_statement'))}<br/><br/>"
            f"<b>Target Users:</b> {self._safe(profile.get('target_users'))}<br/><br/>"
            f"<b>MVP Scope:</b> {self._safe(profile.get('mvp_scope_paragraph'))}<br/><br/>"
            f"<b>Execution Context:</b> {self._safe(profile.get('execution_context'))}<br/><br/>"
            f"<b>MVP Launch Deadline:</b> {self._safe(mvp_plan.get('deadlines', {}).get('mvp_launch'))}<br/>"
            f"<b>Legal Deadline:</b> {self._safe(mvp_plan.get('deadlines', {}).get('legal_deadline'))}"
        )
        self.story.append(Paragraph(intro, self.body_style))
        self.story.append(Spacer(1, 0.18 * inch))

    def add_execution_health(self):
        self._section_title("1. Execution Health Summary")

        monitoring = self.result.get("monitoring", {})
        summary = monitoring.get("summary", {})
        feasibility = self.result.get("feasibility", {})

        data = [
            ["Metric", "Value"],
            ["Total Tasks", self._safe(monitoring.get("task_count", 0))],
            ["Ready Tasks", self._safe(monitoring.get("ready_count", 0))],
            ["Done", self._safe(summary.get("done", 0))],
            ["In Progress", self._safe(summary.get("in_progress", 0))],
            ["Todo", self._safe(summary.get("todo", 0))],
            ["Blocked", self._safe(summary.get("blocked", 0))],
            ["Anomalies", self._safe(monitoring.get("anomaly_count", 0))],
            ["Critic Issues", self._safe(monitoring.get("critic_issues", 0))],
            ["Feasibility Status", self._safe(feasibility.get("status"))],
            ["Critical Path Days", self._safe(feasibility.get("critical_path_days"))],
            ["Deadline Days", self._safe(feasibility.get("deadline_days"))],
            ["Buffer Days", self._safe(feasibility.get("buffer_days"))],
            ["Dependency Cycle", self._safe(self.result.get("dependency_graph_has_cycle"))],
        ]

        table = self._simple_table(
            data=data,
            col_widths=[3.0 * inch, 2.2 * inch],
            header_bg="#0B5394",
            align="CENTER",
            font_size=9,
        )
        self.story.append(table)
        self.story.append(Spacer(1, 0.18 * inch))

    def add_team_section(self):
        self._section_title("2. Team Composition and Workload")

        team = self.result.get("updated_state", {}).get("team", [])
        data = [["Name", "Role", "Availability", "Current Load", "Skills"]]

        for member in team:
            skills = ", ".join(member.get("skills", [])[:5])
            data.append([
                self._safe(member.get("name")),
                self._safe(member.get("role")),
                f"{float(member.get('availability', 1.0)) * 100:.0f}%",
                self._safe(member.get("current_load", 0)),
                self._truncate(skills, 65),
            ])

        table = self._simple_table(
            data=data,
            col_widths=[1.4 * inch, 2.2 * inch, 1.0 * inch, 1.0 * inch, 4.0 * inch],
            header_bg="#134F5C",
            align="LEFT",
            font_size=8,
        )
        self.story.append(table)
        self.story.append(Spacer(1, 0.18 * inch))

    def add_kb_section(self):
        self._section_title("3. Knowledge Retrieval Summary")

        kb = self.result.get("kb_retrieval", {})
        queries = kb.get("queries", [])
        hits = kb.get("hits", [])

        if queries:
            self.story.append(Paragraph("<b>Queries Used</b>", self.sub_style))
            for i, q in enumerate(queries, start=1):
                self.story.append(Paragraph(f"{i}. {self._safe(q)}", self.body_style))
            self.story.append(Spacer(1, 0.08 * inch))

        self.story.append(Paragraph("<b>Top Retrieved Knowledge Snippets</b>", self.sub_style))
        if hits:
            data = [["Category", "Section", "Snippet"]]
            for h in hits[:5]:
                data.append([
                    self._safe(h.get("category")),
                    self._truncate(h.get("section_heading"), 30),
                    self._truncate(h.get("text"), 100),
                ])

            table = self._simple_table(
                data=data,
                col_widths=[1.7 * inch, 2.1 * inch, 5.5 * inch],
                header_bg="#3D85C6",
                align="LEFT",
                font_size=8,
            )
            self.story.append(table)
        else:
            self.story.append(Paragraph("No KB hits available.", self.body_style))

        self.story.append(Spacer(1, 0.18 * inch))

    def add_dependency_analysis(self):
        self._section_title("4. Dependency and Parallel Execution Analysis")

        tasks = self.result.get("task_list", [])
        parallel_groups = self._identify_parallel_groups(tasks)

        self.story.append(Paragraph("<b>Parallel Execution Opportunities</b>", self.sub_style))

        if parallel_groups:
            for idx, group in enumerate(parallel_groups[:6], start=1):
                items = "<br/>".join([f"• {self._truncate(t.get('title'), 90)}" for t in group[:6]])
                self.story.append(Paragraph(f"<b>Parallel Batch {idx}</b><br/>{items}", self.body_style))
                self.story.append(Spacer(1, 0.05 * inch))
        else:
            self.story.append(Paragraph("No parallel execution groups identified.", self.body_style))

        self.story.append(Spacer(1, 0.10 * inch))
        self.story.append(Paragraph("<b>Critical Tasks</b>", self.sub_style))

        critical_tasks = sorted(tasks, key=lambda x: -x.get("criticality_score", 0))[:8]
        data = [["Task", "Milestone", "Est. Days", "Criticality", "Depends On"]]

        id_to_task = {t["id"]: t for t in tasks if "id" in t}

        for task in critical_tasks:
            deps = [id_to_task.get(d, {}).get("title", "Unknown") for d in task.get("depends_on", [])[:2]]
            dep_text = ", ".join(deps) if deps else "None"
            data.append([
                self._truncate(task.get("title"), 42),
                self._truncate(task.get("milestone_title"), 30),
                self._safe(task.get("estimated_days")),
                f"{float(task.get('criticality_score', 0)):.2f}",
                self._truncate(dep_text, 40),
            ])

        table = self._simple_table(
            data=data,
            col_widths=[3.0 * inch, 2.2 * inch, 0.9 * inch, 0.9 * inch, 2.5 * inch],
            header_bg="#CC0000",
            row_bg_1="#FFF5F5",
            row_bg_2="#FDE9E7",
            align="LEFT",
            font_size=8,
        )
        self.story.append(table)
        self.story.append(Spacer(1, 0.18 * inch))

    def add_priority_tasks(self):
        self._section_title("5. Top Priority Tasks")

        tasks = self.result.get("priority_queue", [])
        if not tasks:
            self.story.append(Paragraph("No priority queue available.", self.body_style))
            self.story.append(Spacer(1, 0.12 * inch))
            return

        data = [["#", "Task", "Milestone", "Owner", "Priority", "Est. Days", "Score"]]
        for i, task in enumerate(tasks[:10], start=1):
            data.append([
                str(i),
                self._truncate(task.get("title"), 42),
                self._truncate(task.get("milestone_title"), 30),
                self._safe(task.get("assigned_to"), "Unassigned"),
                self._safe(task.get("priority")).upper(),
                self._safe(task.get("estimated_days")),
                f"{float(task.get('criticality_score', 0)):.2f}",
            ])

        table = self._simple_table(
            data=data,
            col_widths=[0.4 * inch, 3.0 * inch, 2.2 * inch, 1.1 * inch, 0.9 * inch, 0.9 * inch, 0.8 * inch],
            header_bg="#3D85C6",
            align="CENTER",
            font_size=8,
        )
        self.story.append(table)
        self.story.append(Spacer(1, 0.18 * inch))

    def add_blocked_tasks(self):
        self._section_title("6. Blocked Tasks")

        blocked_tasks = [t for t in self.result.get("task_list", []) if t.get("status") == "blocked"]

        if not blocked_tasks:
            self.story.append(Paragraph("No blocked tasks detected.", self.body_style))
            self.story.append(Spacer(1, 0.12 * inch))
            return

        data = [["Task", "Owner", "Priority", "Blocked Reason"]]
        for task in blocked_tasks:
            data.append([
                self._truncate(task.get("title"), 45),
                self._safe(task.get("assigned_to"), "Unassigned"),
                self._safe(task.get("priority")).upper(),
                self._truncate(task.get("blocked_reason"), 70),
            ])

        table = self._simple_table(
            data=data,
            col_widths=[3.1 * inch, 1.4 * inch, 1.0 * inch, 4.2 * inch],
            header_bg="#E69138",
            row_bg_1="#FFF8F0",
            row_bg_2="#FDEBD6",
            align="LEFT",
            font_size=8,
        )
        self.story.append(table)
        self.story.append(Spacer(1, 0.18 * inch))

    def add_anomalies_and_critic(self):
        self._section_title("7. Anomalies and Critic Review")

        anomalies = self.result.get("anomalies", [])
        critic = self.result.get("critic_report", {})
        issues = critic.get("issues_found", [])

        self.story.append(Paragraph("<b>Detected Anomalies</b>", self.sub_style))
        if anomalies:
            for idx, anomaly in enumerate(anomalies[:10], start=1):
                self.story.append(Paragraph(f"{idx}. {self._safe(anomaly)}", self.body_style))
        else:
            self.story.append(Paragraph("No anomalies detected.", self.body_style))

        self.story.append(Spacer(1, 0.08 * inch))
        self.story.append(Paragraph("<b>Critic Issues</b>", self.sub_style))

        if issues:
            for idx, issue in enumerate(issues[:10], start=1):
                if isinstance(issue, dict):
                    txt = (
                        f"{idx}. <b>Issue:</b> {self._safe(issue.get('issue'))}<br/>"
                        f"&nbsp;&nbsp;&nbsp;&nbsp;<b>Severity:</b> {self._safe(issue.get('severity'))}<br/>"
                        f"&nbsp;&nbsp;&nbsp;&nbsp;<b>Suggested Fix:</b> {self._safe(issue.get('suggested_fix'))}"
                    )
                else:
                    txt = f"{idx}. {self._safe(issue)}"
                self.story.append(Paragraph(txt, self.body_style))
        else:
            self.story.append(Paragraph("No critic issues reported.", self.body_style))

        self.story.append(Spacer(1, 0.18 * inch))

    def add_next_actions(self):
        self._section_title("8. Recommended Next Actions")

        next_actions = self.result.get("next_actions", [])
        if not next_actions:
            self.story.append(Paragraph("No next actions generated.", self.body_style))
            self.story.append(Spacer(1, 0.12 * inch))
            return

        for idx, action in enumerate(next_actions[:10], start=1):
            self.story.append(Paragraph(f"{idx}. {self._safe(action)}", self.body_style))

        self.story.append(Spacer(1, 0.18 * inch))

    def add_task_inventory(self):
        self.story.append(PageBreak())
        self._section_title("9. Detailed Task Inventory")

        tasks = self.result.get("task_list", [])
        if not tasks:
            self.story.append(Paragraph("No tasks available.", self.body_style))
            return

        id_to_task = {t["id"]: t for t in tasks if "id" in t}
        data = [[
            "Task",
            "Milestone",
            "Owner",
            "Status",
            "Priority",
            "Est.",
            "Priority Score",
            "Criticality",
            "Depends On"
        ]]

        for task in tasks:
            deps = [id_to_task.get(d, {}).get("title", "Unknown") for d in task.get("depends_on", [])[:2]]
            dep_text = ", ".join(deps) if deps else "None"

            data.append([
                self._truncate(task.get("title"), 36),
                self._truncate(task.get("milestone_title"), 24),
                self._safe(task.get("assigned_to"), "Unassigned"),
                self._safe(task.get("status")).upper(),
                self._safe(task.get("priority")).upper(),
                self._safe(task.get("estimated_days")),
                f"{float(task.get('priority_score', 0)):.2f}",
                f"{float(task.get('criticality_score', 0)):.2f}",
                self._truncate(dep_text, 30),
            ])

        table = self._simple_table(
            data=data,
            col_widths=[2.5 * inch, 1.9 * inch, 1.0 * inch, 1.0 * inch, 0.9 * inch, 0.7 * inch, 0.9 * inch, 0.9 * inch, 2.1 * inch],
            header_bg="#0B5394",
            align="LEFT",
            font_size=7,
        )
        self.story.append(table)
        self.story.append(Spacer(1, 0.18 * inch))

    def add_assignment_analysis(self):
        self.story.append(PageBreak())
        self._section_title("10. Assignment Intelligence Analysis")

        tasks = self.result.get("task_list", [])
        if not tasks:
            self.story.append(Paragraph("No tasks available.", self.body_style))
            return

        data = [[
            "Task",
            "Owner",
            "Match Confidence",
            "Assignment Score",
            "Continuity",
            "Graph Depth",
            "Category"
        ]]

        for task in tasks[:25]:
            data.append([
                self._truncate(task.get("title"), 40),
                self._safe(task.get("assigned_to"), "Unassigned"),
                self._safe(task.get("match_confidence")),
                self._safe(task.get("assignment_score")),
                self._safe(task.get("continuity_score")),
                self._safe(task.get("graph_depth")),
                self._safe(task.get("category")),
            ])

        table = self._simple_table(
            data=data,
            col_widths=[3.1 * inch, 1.1 * inch, 1.1 * inch, 1.1 * inch, 1.0 * inch, 0.9 * inch, 1.5 * inch],
            header_bg="#6A329F",
            row_bg_1="#FAF5FF",
            row_bg_2="#F2E7FF",
            align="LEFT",
            font_size=7,
        )
        self.story.append(table)
        self.story.append(Spacer(1, 0.18 * inch))

    def add_executive_summary(self):
        self.story.append(PageBreak())
        self._section_title("11. Executive Summary")

        feasibility = self.result.get("feasibility", {})
        monitoring = self.result.get("monitoring", {})
        blocked = monitoring.get("summary", {}).get("blocked", 0)
        status = self._safe(feasibility.get("status")).lower()
        cp = self._safe(feasibility.get("critical_path_days"))
        dd = self._safe(feasibility.get("deadline_days"))
        bf = self._safe(feasibility.get("buffer_days"))

        if status == "good":
            text = (
                f"<b>Feasibility Status: GOOD</b><br/>"
                f"The project currently appears feasible. The critical path is {cp} days "
                f"with {bf} days of buffer against the available {dd} days. "
                f"The main recommendation is to keep execution discipline and resolve blockers quickly."
            )
        elif status == "fragile":
            text = (
                f"<b>Feasibility Status: FRAGILE</b><br/>"
                f"The project remains feasible but with limited safety margin. "
                f"The critical path is {cp} days and the current buffer is {bf} days. "
                f"Strict prioritization is required."
            )
        else:
            text = (
                f"<b>Feasibility Status: HIGH RISK</b><br/>"
                f"The project is at risk relative to deadlines. "
                f"The critical path is {cp} days and the available time is {dd} days. "
                f"Scope protection and corrective action are required."
            )

        self.story.append(Paragraph(text, self.body_style))
        self.story.append(Spacer(1, 0.08 * inch))

        metrics = (
            f"<b>Key Metrics</b><br/>"
            f"- Total tasks: {self._safe(monitoring.get('task_count', 0))}<br/>"
            f"- Ready tasks: {self._safe(monitoring.get('ready_count', 0))}<br/>"
            f"- Blocked tasks: {blocked}<br/>"
            f"- Anomalies: {self._safe(monitoring.get('anomaly_count', 0))}<br/>"
            f"- Critic issues: {self._safe(monitoring.get('critic_issues', 0))}"
        )
        self.story.append(Paragraph(metrics, self.body_style))
        self.story.append(Spacer(1, 0.1 * inch))

    # =========================================================
    # GENERATE
    # =========================================================

    def generate(self) -> str:
        self.add_cover()
        self.add_execution_health()
        self.add_team_section()
        self.add_kb_section()
        self.add_dependency_analysis()
        self.add_priority_tasks()
        self.add_blocked_tasks()
        self.add_anomalies_and_critic()
        self.add_next_actions()
        self.add_task_inventory()
        self.add_assignment_analysis()
        self.add_executive_summary()

        self.doc.build(self.story)
        return self.output_path


def load_result_json(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


if __name__ == "__main__":
    input_json = "execution_agent_outputs/execution_result_SkillBridge.json"
    output_pdf = "execution_agent_outputs/SkillBridge_Execution_Report.pdf"

    result = load_result_json(input_json)

    generator = ExecutionAgentPDFReport(
        result=result,
        output_path=output_pdf,
    )
    pdf_path = generator.generate()

    print(f"PDF report generated: {pdf_path}")