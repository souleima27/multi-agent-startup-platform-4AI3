import random


class BackoffStrategy:
    def __init__(self, base_delay_seconds: float = 1.0, jitter_seconds: float = 0.25, max_delay_seconds: float = 30.0):
        self.base_delay_seconds = base_delay_seconds
        self.jitter_seconds = jitter_seconds
        self.max_delay_seconds = max_delay_seconds

    def delay_for(self, attempt: int) -> float:
        exp_delay = min(self.max_delay_seconds, self.base_delay_seconds * (2 ** max(0, attempt - 1)))
        jitter = random.uniform(0.0, self.jitter_seconds)
        return exp_delay + jitter
