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
    input_location: tuple[int, int, int, int] | None = None

    @property
    def is_send(self) -> bool:
        return self.state == "send"

    @property
    def is_stop(self) -> bool:
        return self.state == "stop"

    def __str__(self) -> str:
        return f"State: {self.label} Location={self.location} InputBox={self.input_location}"


class ScreenReader:
    """Finds either the Send icon reference or the red Stop icon reference."""

    def __init__(self, templates_dir: Path | None = None, confidence: float = 0.9) -> None:
        self.templates_dir = templates_dir or Path(__file__).resolve().parents[1] / "templates"
        self.send_template = self.templates_dir / "send-icon.png"
        self.stop_template = self.templates_dir / "stop-icon.png"
        self.input_box_template = self.templates_dir / "input-box.png"
        self.confidence = confidence

    def read_state(self) -> MatchResult:
        send_location = self._find_template(self.send_template)
        stop_location = self._find_template(self.stop_template)
        input_location = self._find_template(self.input_box_template)

        if stop_location is not None and send_location is None:
            return MatchResult("stop", "STOP ICON - do nothing", stop_location, input_location)

        if send_location is not None:
            return MatchResult("send", "SEND ICON - type Next / Continue", send_location, input_location)

        return MatchResult("unknown", "NO TEMPLATE MATCH", None, input_location)

    def _find_template(self, template: Path) -> tuple[int, int, int, int] | None:
        if not template.exists():
            print(f"[DEBUG] Template not found: {template}")
            return None

        try:
            box = pyautogui.locateOnScreen(
                str(template),
                grayscale=True,
                confidence=self.confidence,
            )
            print(f"[DEBUG] Searching {template.name} at conf={self.confidence}: {'FOUND' if box else 'NOT FOUND'}")
        except Exception as e:
            print(f"[DEBUG] Error searching {template.name}: {e}")
            return None

        if box is None:
            return None

        # Reject matches that are too small (likely false positives)
        if box.width < 10 or box.height < 10:
            print(f"[DEBUG] Rejected tiny match for {template.name}: {box.width}x{box.height}")
            return None

        return int(box.left), int(box.top), int(box.width), int(box.height)

    @staticmethod
    def send_click_point(location: tuple[int, int, int, int]) -> tuple[int, int]:
        left, top, width, height = location
        return left + width - 12, top + height // 2

    @staticmethod
    def input_click_point(location: tuple[int, int, int, int]) -> tuple[int, int]:
        left, top, _width, height = location
        x = max(0, left - 120)
        y = top + height // 2
        return int(x), int(y)
