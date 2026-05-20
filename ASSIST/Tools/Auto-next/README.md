# Auto-Next

Template-based helper that watches the chat send/stop control.

- If `templates/stop-icon.png` matches, Auto-Next does nothing.
- If `templates/send-icon.png` matches, Auto-Next types `Next / Continue ` and clicks the matched send icon.
- It scans once every 10 seconds.

## Run

```powershell
python ASSIST\Tools\Auto-next\auto-next.py
```

Use the overlay buttons:

- `START`: starts the 10-second scanner after a short focus countdown.
- `STOP`: pauses the watcher.
- `EXIT`: closes the tool.

After pressing `START`, click the chat input within the short focus delay. Auto-Next types into whichever window currently has keyboard focus.

To start watching immediately:

```powershell
python .\ASSIST\Tools\Auto-next\auto-next.py --autostart
```

## Requirements

```powershell
pip install pyautogui Pillow numpy opencv-python
```

## How It Works

1. On start, the watcher waits briefly so you can focus the chat input.
2. Every 10 seconds, it searches the screen for `templates/stop-icon.png`.
3. If the stop icon matches, it does nothing.
4. If the stop icon does not match, it searches for `templates/send-icon.png`.
5. If the send icon matches, it types `Next / Continue ` and clicks the matched send icon.

## Mini Manual

1. Run `python ASSIST\Tools\Auto-next\auto-next.py`.
2. Press `START`.
3. Click the AI chat input during the countdown.
4. Leave the overlay running.
5. Auto-Next scans every 10 seconds.
6. Red stop/wait icon: no action.
7. Send icon: type `Next / Continue `, wait 2 seconds, submit.
8. Press `STOP` to pause.

## Structure

```text
Auto-next/
|-- auto-next.py
|-- core/
|   |-- engine.py
|   `-- __init__.py
|-- templates/
|   |-- send-icon.png
|   `-- stop-icon.png
|   `-- input-box.png
|-- ui/
|   |-- overlay.py
|   `-- __init__.py
`-- vision/
    |-- screen_reader.py
    `-- __init__.py
```

## Tuning

The defaults match the tested bottom-right chat input behavior:

- `templates/stop-icon.png`: reference for waiting/processing state.
- `templates/send-icon.png`: reference for ready-to-send state.
- `core/engine.py`: scan interval, focus delay, submit delay, typed text.
