import json
import urllib.error
import urllib.request
from typing import Dict

from a2a.adapters.BaseAdapter import BaseAdapter
from a2a.types.schemas import AdapterResponse


class SlackAdapter(BaseAdapter):
    def execute(self, operation: str, payload: Dict[str, object], credentials: Dict[str, str]) -> AdapterResponse:
        url = str(payload.get("url", "https://slack.com/api/chat.postMessage"))
        body = payload.get("body", {})
        if not isinstance(body, dict) or "channel" not in body or "text" not in body:
            return AdapterResponse(success=False, retryable=False, error="Slack payload must include channel and text")

        headers = {
            "Authorization": f"Bearer {credentials.get('api_key', '')}",
            "Content-Type": "application/json; charset=utf-8",
            "Idempotency-Key": str(payload.get("idempotency_key", "")),
        }
        request = urllib.request.Request(
            url=url,
            data=json.dumps(body).encode("utf-8"),
            headers=headers,
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8") or "{}")
                success = bool(data.get("ok")) and 200 <= response.status < 300
                return AdapterResponse(
                    success=success,
                    external_ref_id=str(data.get("ts") or ""),
                    retryable=not success,
                    error=None if success else str(data.get("error", "Slack API error")),
                    status_code=response.status,
                    raw_response=data,
                )
        except urllib.error.HTTPError as exc:
            return AdapterResponse(success=False, retryable=True, error=str(exc), status_code=exc.code)
        except urllib.error.URLError as exc:
            return AdapterResponse(success=False, retryable=True, error=str(exc))
