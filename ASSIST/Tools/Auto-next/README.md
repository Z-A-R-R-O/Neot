# Auto-Next

Template-based helper that watches the AI chat send/stop icons and auto-types "Next / Continue".

- If `templates/stop-icon.png` matches → does nothing (AI is still responding).
- If `templates/send-icon.png` matches → types `Next / Continue `, waits 2s, presses Enter.
- Scans every 20 seconds.

## Run (Python)

```powershell
python ASSIST\Tools\Auto-next\auto-next.py
```

Or start immediately:

```powershell
python ASSIST\Tools\Auto-next\auto-next.py --autostart
```

Tune matching sensitivity (lower = more tolerant):

```powershell
python ASSIST\Tools\Auto-next\auto-next.py --confidence 0.6
```

## Run (Executable)

```powershell
.\ASSIST\Tools\Auto-next\dist\Auto-Next.exe
.\ASSIST\Tools\Auto-next\dist\Auto-Next.exe --autostart
.\ASSIST\Tools\Auto-next\dist\Auto-Next.exe --confidence 0.6
```

## Controls

| Button | Action |
|--------|--------|
| `START` | Starts scanning after a 3s focus delay (click the chat input during this) |
| `STOP`  | Pauses the watcher |
| `EXIT`  | Closes the tool |

## Requirements (Python only)

```powershell
pip install pyautogui Pillow numpy opencv-python
```

The `.exe` has everything bundled — no dependencies needed.

## How It Works

1. Press `START` → 3s countdown to focus the chat input.
2. Every 20s it scans the screen for `templates/stop-icon.png`.
3. If stop icon matches → AI is still typing, skip.
4. If send icon matches → type `Next / Continue `, wait 2s, press Enter.
5. Re-scan to confirm the send icon changed to a stop icon.

## Tuning

| Flag | Default | Effect |
|------|---------|--------|
| `--confidence` | 0.7 | Lower = matches more easily. Try 0.6 if icons aren't detected |
| `--autostart` | off | Skip the START button, begin immediately |

If Auto-Next doesn't detect icons:
1. Make sure the AI chat is visible on screen (not minimized/covered).
2. Lower confidence: `--confidence 0.6`
3. Re-capture templates from your actual screen.

## Structure

```text
Auto-next/
├── auto-next.py          ← Entry point
├── Auto-Next.spec        ← PyInstaller spec for .exe build
├── README.md
├── core/engine.py        ← Scan loop, typing logic
├── ui/overlay.py         ← Tkinter overlay window
├── vision/screen_reader.py ← Template matching with confidence tuning
├── templates/            ← Reference icon images
│   ├── send-icon.png
│   ├── stop-icon.png
│   └── input-box.png
└── dist/                 ← Built .exe lives here
    └── Auto-Next.exe
```