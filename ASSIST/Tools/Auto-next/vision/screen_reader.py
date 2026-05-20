"""Template-based screen detection for Auto-Next."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pyautogui


@dataclass(frozen=True)
class MatchResult:
    state: str
    label: str
    location: tuple[int, int, int, int] | None = None

    @property
    def is_send(self) -> bool:
        return self.state == "send"

    @property
    def is_stop(self) -> bool:
        return self.state == "stop"

    def __str__(self) -> str:
        return f"State: {self.label} Location={self.location}"


class ScreenReader:
    """Finds either the Send icon reference or the red Stop icon reference."""

    def __init__(self, templates_dir: Path | None = None, confidence: float = 0.8) -> None:
        self.templates_dir = templates_dir or Path(__file__).resolve().parents[1] / "templates"
        self.send_template = self.templates_dir / "send-icon.png"
        self.stop_template = self.templates_dir / "stop-icon.png"
        self.confidence = confidence

    def read_state(self) -> MatchResult:
        stop_location = self._find_template(self.stop_template)
        if stop_location is not None:
            return MatchResult("stop", "STOP ICON - do nothing", stop_location)

        send_location = self._find_template(self.send_template)
        if send_location is not None:
            return MatchResult("send", "SEND ICON - type Next", send_location)

        return MatchResult("unknown", "NO TEMPLATE MATCH")

    def _find_template(self, template: Path) -> tuple[int, int, int, int] | None:
        if not template.exists():
            return None

        try:
            box = pyautogui.locateOnScreen(
                str(template),
                grayscale=True,
                confidence=self.confidence,
            )
        except Exception:
            return None

        if box is None:
            return None

        return int(box.left), int(box.top), int(box.width), int(box.height)

    @staticmethod
    def send_click_point(location: tuple[int, int, int, int]) -> tuple[int, int]:
        left, top, width, height = location
        return left + width - 12, top + height // 2
