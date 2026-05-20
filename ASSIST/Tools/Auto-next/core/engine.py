"""Simple template-driven Auto-Next engine."""

from __future__ import annotations

import threading
import time
from dataclasses import dataclass
from typing import Callable

import pyautogui

from vision.screen_reader import MatchResult, ScreenReader


LogCallback = Callable[[str], None]
StatusCallback = Callable[[str], None]


@dataclass(frozen=True)
class EngineConfig:
    scan_interval_seconds: float = 20.0
    focus_delay_seconds: float = 3.0
    submit_delay_seconds: float = 2.0
    send_text: str = "Next"
    type_interval_seconds: float = 0.05


class AutoNextEngine:
    """Every scan: stop icon does nothing, send icon types Next and submits."""

    def __init__(
        self,
        reader: ScreenReader,
        config: EngineConfig | None = None,
        log_callback: LogCallback | None = None,
        status_callback: StatusCallback | None = None,
        action_callback: StatusCallback | None = None,
    ) -> None:
        self.reader = reader
        self.config = config or EngineConfig()
        self.log = log_callback or print
        self.update_status = status_callback or (lambda _text: None)
        self.update_action = action_callback or (lambda _text: None)

        self._running = threading.Event()
        self._shutdown = threading.Event()
        self._watch_after = 0.0
        self._last_state: str | None = None

    def set_callbacks(
        self,
        log_callback: LogCallback,
        status_callback: StatusCallback,
        action_callback: StatusCallback,
    ) -> None:
        self.log = log_callback
        self.update_status = status_callback
        self.update_action = action_callback

    def start(self) -> None:
        self._watch_after = time.time() + self.config.focus_delay_seconds
        self._last_state = None
        self._running.set()
        self.log("Started. Click the chat input now.")
        self.update_status("Focus Chat")
        self.update_action(f"Scanning starts in {self.config.focus_delay_seconds:.0f}s")

    def stop(self) -> None:
        self._running.clear()
        self.log("Stopped.")
        self.update_status("Paused")
        self.update_action("Manual pause")

    def shutdown(self) -> None:
        self._running.clear()
        self._shutdown.set()

    def run_forever(self) -> None:
        while not self._shutdown.is_set():
            if not self._running.is_set():
                time.sleep(0.2)
                continue

            now = time.time()
            if now < self._watch_after:
                remaining = max(0.0, self._watch_after - now)
                self.update_status("Focus Chat")
                self.update_action(f"Scanning starts in {remaining:.1f}s")
                time.sleep(0.2)
                continue

            try:
                self._scan_once()
            except Exception as exc:
                self.log(f"Error: {exc}")
                self.update_status("Error")
                self.update_action(str(exc))

            time.sleep(self.config.scan_interval_seconds)

    def _scan_once(self) -> None:
        state = self.reader.read_state()
        self._log_state(state)

        if state.is_stop:
            self.update_status("Waiting")
            self.update_action("Stop icon matched")
            return

        if state.is_send:
            self.update_status("Ready")
            self.update_action("Typing Next")
            self._type_next_and_submit(state)
            return

        self.update_status("Scanning")
        self.update_action("No icon matched")

    def _log_state(self, state: MatchResult) -> None:
        if state.state != self._last_state:
            self.log(str(state))
            self._last_state = state.state
        else:
            self.log(f"SCAN: {state}")

    def _type_next_and_submit(self, state: MatchResult) -> None:
        pyautogui.write(self.config.send_text, interval=self.config.type_interval_seconds)
        time.sleep(self.config.submit_delay_seconds)

        pyautogui.press("enter")
        self.log("Typed Next and pressed Enter.")
