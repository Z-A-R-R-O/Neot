# Auto-Next Tools

## Python Version (Recommended)
Uses screen recognition to find the Send button visually.

### Setup
1. Dependencies installed: `pyautogui`, `opencv-python`
2. Capture your Send button:
   - Take a screenshot of the Send button icon in your chat interface
   - Save it as `send-btn.png` in this folder
   - The script will look for this image on screen and click it when it appears

### How it works
1. Checks checklists for remaining tasks
2. Types "Next"
3. Scans screen for `send-btn.png`
4. Clicks the button when found
5. Falls back to Tab+Enter if image not found

## PowerShell Version (Fallback)
Keyboard-only simulation. Used if Python is not available.
- Types "Next"
- Waits 2 seconds
- Presses Tab then Enter
