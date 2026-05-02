from collections import deque
from typing import Deque, Dict, List, Set

from a2a.types.schemas import ExternalActionEnvelope


class SequenceGate:
    """Dependency gate for external actions."""

    def __init__(self):
        self._settled: Set[str] = set()
        self._parked: Dict[str, ExternalActionEnvelope] = {}

    def can_execute(self, envelope: ExternalActionEnvelope) -> bool:
        return all(dep in self._settled for dep in envelope.depends_on)

    def park(self, envelope: ExternalActionEnvelope) -> None:
        self._parked[envelope.action_id] = envelope

    def mark_settled(self, action_id: str) -> List[ExternalActionEnvelope]:
        self._settled.add(action_id)
        released: Deque[ExternalActionEnvelope] = deque()

        for parked_id, envelope in list(self._parked.items()):
            if self.can_execute(envelope):
                released.append(envelope)
                del self._parked[parked_id]

        return sorted(list(released), key=lambda item: (item.seq, item.action_id))

    @property
    def settled_ids(self) -> Set[str]:
        return set(self._settled)

    @property
    def parked_count(self) -> int:
        return len(self._parked)
