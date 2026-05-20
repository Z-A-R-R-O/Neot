"""Tkinter overlay UI for Auto-Next."""

from __future__ import annotations

import queue
import tkinter as tk
from typing import Callable


class OverlayUI:
    """Small always-on-top control window with live logs."""

    def __init__(
        self,
        start_callback: Callable[[], None],
        stop_callback: Callable[[], None],
        exit_callback: Callable[[], None],
        initial_status: str = "Idle",
    ) -> None:
        self.start_callback = start_callback
        self.stop_callback = stop_callback
        self.exit_callback = exit_callback
        self.initial_status = initial_status

        self.root: tk.Tk | None = None
        self.status_label: tk.Label | None = None
        self.action_label: tk.Label | None = None
        self.log_listbox: tk.Listbox | None = None
        self.log_queue: queue.Queue[str] = queue.Queue()
        self.ui_queue: queue.Queue[tuple[str, str]] = queue.Queue()

    def create(self) -> None:
        self.root = tk.Tk()
        self.root.title("Auto-Next Smart")
        self.root.attributes("-topmost", True)
        self.root.overrideredirect(True)

        screen_width = self.root.winfo_screenwidth()
        self.root.geometry(f"210x185+{screen_width - 230}+50")

        frame = tk.Frame(self.root, bg="#1a202c", bd=2, relief="solid")
        frame.pack(fill="both", expand=True)

        title = tk.Frame(frame, bg="#2d3748")
        title.pack(fill="x")
        tk.Label(
            title,
            text="Auto-Next Smart",
            bg="#2d3748",
            fg="white",
            font=("Segoe UI", 9, "bold"),
        ).pack(side="left", padx=8, pady=5)

        self.status_label = tk.Label(
            frame,
            text=self.initial_status,
            bg="#1a202c",
            fg="#a0aec0",
            font=("Segoe UI", 10, "bold"),
        )
        self.status_label.pack(pady=(6, 0))

        self.action_label = tk.Label(
            frame,
            text="Press START to begin",
            bg="#1a202c",
            fg="#63b3ed",
            font=("Segoe UI", 8),
        )
        self.action_label.pack(pady=(2, 0))

        self.log_listbox = tk.Listbox(
            frame,
            bg="#2d3748",
            fg="#e2e8f0",
            font=("Consolas", 7),
            height=5,
            bd=0,
            highlightthickness=0,
        )
        self.log_listbox.pack(fill="both", expand=True, padx=5, pady=5)

        buttons = tk.Frame(frame, bg="#1a202c")
        buttons.pack(pady=(0, 6))

        self._button(buttons, "START", "#48bb78", self.start_callback).pack(side="left", padx=2)
        self._button(buttons, "STOP", "#e53e3e", self.stop_callback).pack(side="left", padx=2)
        self._button(buttons, "EXIT", "#718096", self.exit_callback).pack(side="left", padx=2)

        self._make_draggable(frame)
        self._make_draggable(title)
        self._process_log_queue()

    def _button(
        self,
        parent: tk.Frame,
        text: str,
        color: str,
        command: Callable[[], None],
    ) -> tk.Button:
        return tk.Button(
            parent,
            text=text,
            bg=color,
            fg="white",
            font=("Segoe UI", 8, "bold"),
            command=command,
            relief="flat",
            bd=0,
            padx=8,
            pady=2,
        )

    def _make_draggable(self, widget: tk.Widget) -> None:
        def start_move(event: tk.Event) -> None:
            if self.root is None:
                return
            self.root._drag_start_x = event.x
            self.root._drag_start_y = event.y

        def stop_move(_event: tk.Event) -> None:
            if self.root is None:
                return
            self.root._drag_start_x = None
            self.root._drag_start_y = None

        def on_move(event: tk.Event) -> None:
            if self.root is None:
                return
            start_x = getattr(self.root, "_drag_start_x", None)
            start_y = getattr(self.root, "_drag_start_y", None)
            if start_x is None or start_y is None:
                return

            x = self.root.winfo_x() + event.x - start_x
            y = self.root.winfo_y() + event.y - start_y
            self.root.geometry(f"+{x}+{y}")

        widget.bind("<ButtonPress-1>", start_move)
        widget.bind("<ButtonRelease-1>", stop_move)
        widget.bind("<B1-Motion>", on_move)

    def _process_log_queue(self) -> None:
        try:
            while True:
                self._add_log(self.log_queue.get_nowait())
        except queue.Empty:
            pass

        try:
            while True:
                kind, text = self.ui_queue.get_nowait()
                if kind == "status":
                    self._apply_status(text)
                elif kind == "action":
                    self._apply_action(text)
        except queue.Empty:
            pass

        if self.root is not None:
            self.root.after(100, self._process_log_queue)

    def _add_log(self, message: str) -> None:
        if self.log_listbox is None:
            return

        self.log_listbox.insert(tk.END, f"> {message}")
        self.log_listbox.see(tk.END)
        if self.log_listbox.size() > 6:
            self.log_listbox.delete(0)

    def update_status(self, text: str) -> None:
        self.ui_queue.put(("status", text))

    def update_action(self, text: str) -> None:
        self.ui_queue.put(("action", text))

    def _apply_status(self, text: str) -> None:
        if self.status_label is not None:
            self.status_label.config(text=text)

    def _apply_action(self, text: str) -> None:
        if self.action_label is not None:
            self.action_label.config(text=text)

    def log(self, message: str) -> None:
        self.log_queue.put(message)
        print(f"[AUTO-NEXT] {message}")

    def run(self) -> None:
        if self.root is None:
            raise RuntimeError("create() must be called before run().")
        self.root.mainloop()

    def destroy(self) -> None:
        if self.root is not None:
            self.root.destroy()
