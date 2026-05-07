import smtplib
from email.message import EmailMessage
from typing import Dict

from a2a.adapters.BaseAdapter import BaseAdapter
from a2a.types.schemas import AdapterResponse


class EmailAdapter(BaseAdapter):
    def execute(self, operation: str, payload: Dict[str, object], credentials: Dict[str, str]) -> AdapterResponse:
        host = payload.get("smtp_host")
        port = int(payload.get("smtp_port", 587))
        sender = payload.get("from_email")
        recipient = payload.get("to_email")
        subject = str(payload.get("subject", ""))
        body = str(payload.get("body", ""))

        if not all([host, sender, recipient]):
            return AdapterResponse(success=False, retryable=False, error="Email payload missing smtp_host/from_email/to_email")

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = str(sender)
        message["To"] = str(recipient)
        message["X-Idempotency-Key"] = str(payload.get("idempotency_key", ""))
        message.set_content(body)

        try:
            with smtplib.SMTP(str(host), port, timeout=30) as smtp:
                smtp.starttls()
                username = credentials.get("username") or str(sender)
                password = credentials.get("password", "")
                if password:
                    smtp.login(username, password)
                smtp.send_message(message)
            return AdapterResponse(success=True, external_ref_id=str(payload.get("idempotency_key", "")))
        except smtplib.SMTPException as exc:
            return AdapterResponse(success=False, retryable=True, error=str(exc))
        except OSError as exc:
            return AdapterResponse(success=False, retryable=True, error=str(exc))
