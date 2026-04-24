from __future__ import annotations

import asyncio


def run_coro_sync(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)
    raise RuntimeError('run_coro_sync cannot be used inside an active event loop')
