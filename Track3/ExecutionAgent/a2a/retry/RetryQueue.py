import time
from typing import Callable

from a2a.retry.BackoffStrategy import BackoffStrategy
from a2a.retry.DeadLetterQueue import DeadLetterQueue
from a2a.types.schemas import AdapterResponse, ExternalActionEnvelope, ExternalActionResult


class RetryQueue:
    """Retry executor for external actions."""

    def __init__(self, backoff_strategy: BackoffStrategy | None = None, dead_letter_queue: DeadLetterQueue | None = None):
        self.backoff_strategy = backoff_strategy or BackoffStrategy()
        self.dead_letter_queue = dead_letter_queue or DeadLetterQueue()

    def execute(
        self,
        envelope: ExternalActionEnvelope,
        executor: Callable[[], AdapterResponse],
        on_failure_handler: Callable[[ExternalActionEnvelope, ExternalActionResult], None] | None = None,
    ) -> ExternalActionResult:
        max_attempts = envelope.execution_policy.max_attempts
        attempts = 0
        last_result = ExternalActionResult.from_failure(
            envelope=envelope,
            error="No attempt executed",
            retryable=True,
            attempts=0,
        )

        while attempts < max_attempts:
            attempts += 1
            try:
                adapter_result = executor()
            except Exception as exc:  # pragma: no cover - adapter boundary
                adapter_result = AdapterResponse(success=False, retryable=True, error=str(exc))

            result = ExternalActionResult.from_adapter_response(
                envelope=envelope,
                adapter_result=adapter_result,
                attempts=attempts,
            )

            if result.success:
                return result

            last_result = result
            if not result.retryable or attempts >= max_attempts:
                self.dead_letter_queue.push(envelope, result)
                if on_failure_handler is not None:
                    on_failure_handler(envelope, result)
                return result

            time.sleep(self.backoff_strategy.delay_for(attempts))

        return last_result
