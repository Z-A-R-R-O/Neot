#!/usr/bin/env python3
"""Auto-Next launcher for NEOT."""

from __future__ import annotations

import argparse
import os
import sys
import threading


def _enable_windows_dpi_awareness() -> None:
    if os.name != "nt":
        return

    try:
        import ctypes

        ctypes.windll.user32.SetProcessDPIAware()
        try:
            ctypes.windll.shcore.SetProcessDpiAwareness(1)
        except Exception:
            pass
    except Exception:
        pass


def _check_dependencies() -> None:
    missing: list[str] = []

    try:
        import pyautogui  # noqa: F401
    except ImportError:
        missing.append("pyautogui")

    try:
        import PIL  # noqa: F401
    except ImportError:
        missing.append("Pillow")

    try:
        import numpy  # noqa: F401
    except ImportError:
        missing.append("numpy")

    try:
        import cv2  # noqa: F401
    except ImportError:
        missing.append("opencv-python")

    if missing:
        print(f"Error: missing dependencies: {', '.join(missing)}")
        print("Install with: pip install pyautogui Pillow numpy opencv-python")
        sys.exit(1)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Screen-aware Auto-Next watcher.")
    parser.add_argument(
        "--autostart",
        action="store_true",
        help="Start watching as soon as the overlay opens.",
    )
    return parser.parse_args()


def main() -> int:
    _enable_windows_dpi_awareness()
    _check_dependencies()

    from core.engine import AutoNextEngine
    from ui.overlay import OverlayUI
    from vision.screen_reader import ScreenReader

    args = parse_args()
    reader = ScreenReader()
    engine = AutoNextEngine(reader=reader)

    ui = OverlayUI(
        start_callback=engine.start,
        stop_callback=engine.stop,
        exit_callback=lambda: None,
        initial_status="Idle",
    )

    engine.set_callbacks(
        log_callback=ui.log,
        status_callback=ui.update_status,
        action_callback=ui.update_action,
    )

    def exit_app() -> None:
        engine.shutdown()
        ui.destroy()

    ui.exit_callback = exit_app
    ui.create()

    worker = threading.Thread(target=engine.run_forever, daemon=True)
    worker.start()

    ui.log("Initialized Smart Auto-Next.")
    if args.autostart:
        engine.start()

    ui.run()
    engine.shutdown()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
