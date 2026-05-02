from typing import Dict

from a2a.adapters.BaseAdapter import BaseAdapter


class RoutingTable:
    """Maps external systems to adapter instances."""

    def __init__(self):
        self._routes: Dict[str, BaseAdapter] = {}

    def register(self, system: str, adapter: BaseAdapter) -> None:
        self._routes[system.strip().lower()] = adapter

    def resolve(self, system: str) -> BaseAdapter:
        key = system.strip().lower()
        if key not in self._routes:
            raise KeyError(f"No adapter registered for system: {system}")
        return self._routes[key]

    def systems(self):
        return tuple(sorted(self._routes.keys()))
