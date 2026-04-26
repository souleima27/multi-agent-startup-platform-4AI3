from app.api.main import app


def test_run_case_route_registered():
    paths = {route.path for route in app.routes}
    assert "/run-case" in paths
    assert "/track-b/run" in paths
