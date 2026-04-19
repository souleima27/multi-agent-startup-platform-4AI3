import json
import urllib.error
import urllib.request
from typing import Dict

from a2a.adapters.BaseAdapter import BaseAdapter
from a2a.types.schemas import AdapterResponse


class CalendarAdapter(BaseAdapter):
    def execute(self, operation: str, payload: Dict[str, object], credentials: Dict[str, str]) -> AdapterResponse:
        url = payload.get("url")
        if not url:
            return AdapterResponse(success=False, retryable=False, error="Missing Calendar url in payload")

        method = str(payload.get("method", "POST")).upper()
        headers = {
            "Authorization": f"Bearer {credentials.get('api_key', '')}",
            "Content-Type": "application/json",
            "Idempotency-Key": str(payload.get("idempotency_key", "")),
        }
        body = json.dumps(payload.get("body", {})).encode("utf-8")
        request = urllib.request.Request(url=str(url), data=body, headers=headers, method=method)

        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8") or "{}")
                return AdapterResponse(
                    success=200 <= response.status < 300,
                    external_ref_id=str(data.get("id") or data.get("eventId") or ""),
                    retryable=False,
                    status_code=response.status,
                    raw_response=data,
                )
        except urllib.error.HTTPError as exc:
            return AdapterResponse(success=False, retryable=True, error=str(exc), status_code=exc.code)
        except urllib.error.URLError as exc:
            return AdapterResponse(success=False, retryable=True, error=str(exc))
