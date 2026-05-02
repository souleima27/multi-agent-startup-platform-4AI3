from __future__ import annotations

import os
from collections import deque
from typing import Any, Deque, Dict, Iterable, List, Optional

from a2a.adapters.CalendarAdapter import CalendarAdapter
from a2a.adapters.EmailAdapter import EmailAdapter
from a2a.adapters.GitHubAdapter import GitHubAdapter
from a2a.adapters.JiraAdapter import JiraAdapter
from a2a.adapters.NotionAdapter import NotionAdapter
from a2a.adapters.SlackAdapter import SlackAdapter
from a2a.retry.BackoffStrategy import BackoffStrategy
from a2a.retry.DeadLetterQueue import DeadLetterQueue
from a2a.retry.RetryQueue import RetryQueue
from a2a.router.RateLimiter import RateLimiter
from a2a.router.RoutingTable import RoutingTable
from a2a.router.SchemaValidator import SchemaValidationError, SchemaValidator
from a2a.router.SequenceGate import SequenceGate
from a2a.store.AuditLog import AuditLog
from a2a.store.ResultStore import ResultStore
from a2a.types.schemas import ExternalActionEnvelope, ExternalActionResult


class Router:
    """Plane 3 A2A router."""

    CREDENTIAL_ENV_MAP = {
        "jira": "JIRA_API_KEY",
        "slack": "SLACK_API_KEY",
        "email": "EMAIL_SMTP_PASSWORD",
        "github": "GITHUB_TOKEN",
        "notion": "NOTION_API_KEY",
        "calendar": "CALENDAR_API_KEY",
    }

    def __init__(
        self,
        routing_table: Optional[RoutingTable] = None,
        sequence_gate: Optional[SequenceGate] = None,
        rate_limiter: Optional[RateLimiter] = None,
        retry_queue: Optional[RetryQueue] = None,
        result_store: Optional[ResultStore] = None,
        audit_log: Optional[AuditLog] = None,
        pending_external_actions: Optional[Iterable[Any]] = None,
    ):
        self.routing_table = routing_table or RoutingTable()
        self.sequence_gate = sequence_gate or SequenceGate()
        self.rate_limiter = rate_limiter or RateLimiter()
        self.retry_queue = retry_queue or RetryQueue(
            backoff_strategy=BackoffStrategy(),
            dead_letter_queue=DeadLetterQueue(),
        )
        self.result_store = result_store or ResultStore()
        self.audit_log = audit_log or AuditLog()
        self.pending_external_actions: Deque[Any] = deque(pending_external_actions or [])
        self._register_default_adapters()

    def _register_default_adapters(self) -> None:
        registered = set(self.routing_table.systems())
        if "jira" not in registered:
            self.routing_table.register("jira", JiraAdapter())
        if "slack" not in registered:
            self.routing_table.register("slack", SlackAdapter())
        if "email" not in registered:
            self.routing_table.register("email", EmailAdapter())
        if "github" not in registered:
            self.routing_table.register("github", GitHubAdapter())
        if "notion" not in registered:
            self.routing_table.register("notion", NotionAdapter())
        if "calendar" not in registered:
            self.routing_table.register("calendar", CalendarAdapter())

    def enqueue(self, action: Any) -> None:
        self.pending_external_actions.append(action)

    def enqueue_many(self, actions: Iterable[Any]) -> None:
        for action in actions:
            self.enqueue(action)

    def dispatch_pending(self) -> List[ExternalActionResult]:
        results: List[ExternalActionResult] = []
        while self.pending_external_actions:
            raw_action = self.pending_external_actions.popleft()
            result = self.dispatch(raw_action)
            if result is not None:
                results.append(result)
        return results

    def dispatch(self, raw_action: Any) -> Optional[ExternalActionResult]:
        try:
            envelope = SchemaValidator.validate(raw_action)
        except SchemaValidationError as exc:
            self.audit_log.append("schema_validation_failed", {"error": str(exc), "raw_action": str(raw_action)})
            raise

        if not self.sequence_gate.can_execute(envelope):
            self.sequence_gate.park(envelope)
            self.audit_log.append(
                "action_parked",
                {
                    "action_id": envelope.action_id,
                    "depends_on": envelope.depends_on,
                    "system": envelope.destination.system,
                },
            )
            return None

        result = self._execute_validated(envelope)

        if result.settled:
            released = self.sequence_gate.mark_settled(envelope.action_id)
            for released_action in released:
                self.pending_external_actions.appendleft(released_action)

        return result

    def _execute_validated(self, envelope: ExternalActionEnvelope) -> ExternalActionResult:
        system = envelope.destination.system
        operation = envelope.destination.operation
        adapter = self.routing_table.resolve(system)
        credentials = self._resolve_credentials(system, envelope.payload)

        self.audit_log.append(
            "external_action_started",
            {
                "action_id": envelope.action_id,
                "system": system,
                "operation": operation,
                "depends_on": envelope.depends_on,
            },
        )

        self.rate_limiter.acquire(envelope.execution_policy.rate_limit_key or system)
        payload = envelope.payload_with_idempotency()

        result = self.retry_queue.execute(
            envelope=envelope,
            executor=lambda: adapter.execute(operation, payload, credentials),
            on_failure_handler=self._on_failure,
        )

        self.result_store.append(result)
        self.audit_log.append(
            "external_action_completed",
            {
                "action_id": envelope.action_id,
                "system": system,
                "operation": operation,
                "success": result.success,
                "retryable": result.retryable,
                "attempts": result.attempts,
                "status_code": result.status_code,
            },
        )
        return result

    def _resolve_credentials(self, system: str, payload: Dict[str, Any]) -> Dict[str, str]:
        env_name = self.CREDENTIAL_ENV_MAP.get(system)
        credentials: Dict[str, str] = {}

        if env_name:
            credentials["api_key"] = os.getenv(env_name, "")

        if system == "email":
            credentials["username"] = str(payload.get("smtp_username") or payload.get("from_email") or "")
            credentials["password"] = os.getenv(self.CREDENTIAL_ENV_MAP["email"], "")

        return credentials

    def _on_failure(self, envelope: ExternalActionEnvelope, result: ExternalActionResult) -> None:
        self.audit_log.append(
            "external_action_failed",
            {
                "action_id": envelope.action_id,
                "system": envelope.destination.system,
                "operation": envelope.destination.operation,
                "error": result.error,
                "attempts": result.attempts,
            },
        )
