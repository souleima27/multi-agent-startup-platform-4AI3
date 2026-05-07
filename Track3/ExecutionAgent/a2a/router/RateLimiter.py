import threading
import time
from dataclasses import dataclass
from typing import Dict


@dataclass
class TokenBucket:
    rate_per_second: float
    capacity: float
    tokens: float
    last_refill: float


class RateLimiter:
    """Token-bucket rate limiter keyed by external system."""

    DEFAULT_LIMITS = {
        "slack": 1.0,
        "jira": 5.0,
        "email": 2.0,
        "github": 2.0,
        "notion": 2.0,
        "calendar": 2.0,
    }

    def __init__(self, limits: Dict[str, float] | None = None):
        self._limits = {**self.DEFAULT_LIMITS, **(limits or {})}
        self._buckets: Dict[str, TokenBucket] = {}
        self._lock = threading.Lock()

    def acquire(self, system: str) -> None:
        key = system.strip().lower()
        with self._lock:
            bucket = self._buckets.get(key)
            if bucket is None:
                rate = float(self._limits.get(key, 1.0))
                bucket = TokenBucket(
                    rate_per_second=rate,
                    capacity=max(1.0, rate),
                    tokens=max(1.0, rate),
                    last_refill=time.monotonic(),
                )
                self._buckets[key] = bucket

            while True:
                now = time.monotonic()
                elapsed = now - bucket.last_refill
                bucket.tokens = min(bucket.capacity, bucket.tokens + elapsed * bucket.rate_per_second)
                bucket.last_refill = now

                if bucket.tokens >= 1.0:
                    bucket.tokens -= 1.0
                    return

                wait_for = (1.0 - bucket.tokens) / max(bucket.rate_per_second, 0.001)
                self._lock.release()
                try:
                    time.sleep(wait_for)
                finally:
                    self._lock.acquire()
