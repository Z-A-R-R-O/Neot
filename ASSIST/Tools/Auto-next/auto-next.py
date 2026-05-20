#!/usr/bin/env python3
"""
Auto-Next for NEOT - Smart Screen-Aware Version
Uses PyAutoGUI to visually detect the Send button and click it only when ready.
"""

import sys
import time
import subprocess
import os
import re
import argparse

try:
    import pyautogui
except ImportError:
    print("  [AUTO-NEXT] Error: pyautogui not installed.")
    print("  Run: pip install pyautogui opencv-python")
    sys.exit(1)

# Configuration
DELAY_BEFORE_TYPING = 1
WAIT_TIMEOUT = 10  # Seconds to wait for send button
CONFIDENCE = 0.8   # Image match confidence
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SEND_BTN_IMAGE = os.path.join(SCRIPT_DIR, "send-btn.png")

def get_remaining_tasks():
    """Analyze checklists to decide if we should proceed."""
    try:
        repo_root = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], stderr=subprocess.DEVNULL).decode().strip()
    except Exception:
        print("  [AUTO-NEXT] Error: Not in a git repository.")
        return 0

    assist_path = os.path.join(repo_root, "ASSIST")
    checklists_path = os.path.join(assist_path, "Execution", "checklists")
    
    if not os.path.exists(checklists_path):
        return 0

    total = 0
    for filename in os.listdir(checklists_path):
        if filename.endswith(".md"):
            filepath = os.path.join(checklists_path, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                # Count unchecked items
                total += len(re.findall(r'- \[ \]', content))
                total += content.count('🔲')
    return total

def type_next():
    """Type 'Next' using keyboard simulation."""
    pyautogui.write("Next", interval=0.05)

def wait_for_send_button():
    """Wait for the send button to appear on screen and click it."""
    print("  [AUTO-NEXT] Waiting for send button...")
    
    # If we have a reference image, use image recognition
    if os.path.exists(SEND_BTN_IMAGE):
        start_time = time.time()
        while time.time() - start_time < WAIT_TIMEOUT:
            try:
                location = pyautogui.locateOnScreen(SEND_BTN_IMAGE, confidence=CONFIDENCE)
                if location:
                    center = pyautogui.center(location)
                    print(f"  [AUTO-NEXT] Send button found at {center}. Clicking...")
                    pyautogui.click(center)
                    return True
            except Exception:
                pass
            time.sleep(0.2)
        print("  [AUTO-NEXT] Send button not found via image. Falling back to keyboard.")
    
    # Fallback: Tab + Enter
    print("  [AUTO-NEXT] Using keyboard fallback (Tab + Enter)...")
    time.sleep(0.5)
    pyautogui.press("tab")
    time.sleep(0.3)
    pyautogui.press("enter")
    return False

import argparse

# ... (existing imports)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-Force", action="store_true", help="Force next even if no tasks")
    args = parser.parse_args()

    print("")
    print("  [AUTO-NEXT] Analyzing project state (Python)...")
    
    remaining = get_remaining_tasks()
    print(f"    Tasks remaining: {remaining}")
    
    if remaining == 0 and not args.Force:
        print("  [AUTO-NEXT] No tasks remaining. Skipping.")
        return
    elif args.Force:
        print("  [AUTO-NEXT] Force mode enabled.")

    print(f"  [AUTO-NEXT] Typing 'Next' in {DELAY_BEFORE_TYPING}s...")
    time.sleep(DELAY_BEFORE_TYPING)
    
    type_next()
    time.sleep(1)  # Wait for UI to process text
    
    wait_for_send_button()
    print("  [AUTO-NEXT] Done.")

if __name__ == "__main__":
    main()
