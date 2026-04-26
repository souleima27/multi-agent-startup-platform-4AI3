from app.services.mcp_context import MCPContextManager


def test_mcp_context_manager_keys_present():
    ctx = MCPContextManager(
        startup_info={"startup_name": "Demo"},
        sector="AI SaaS",
        recommended_legal_form="SA",
        founders_structure="2 associates",
        startup_act_score=78.0,
        uploaded_documents=["doc1.png"],
        missing_documents=["cin"],
    )

    payload = ctx.to_dict()
    expected_keys = {
        "startup_info",
        "sector",
        "recommended_legal_form",
        "founders_structure",
        "funding_needs",
        "startup_act_score",
        "uploaded_documents",
        "ocr_text",
        "document_validation_results",
        "missing_documents",
        "workflow_steps",
        "checklist",
        "final_report",
    }
    assert expected_keys.issubset(set(payload.keys()))
    assert payload["recommended_legal_form"] == "SA"
