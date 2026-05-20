#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Auto-Next for NEOT - Smart decision engine: types "Next" only when there's work remaining.
.DESCRIPTION
  Analyzes checklists, masterplan, and current state to decide whether to type "Next".
  Only triggers when there are remaining tasks to work on.
.EXAMPLE
  .\auto-next.ps1
  # Checks state and types "Next" if work remains
.EXAMPLE
  .\auto-next.ps1 -Force
  # Always type "Next" regardless of state
#>

param(
  [Parameter(Position = 0)]
  [int]$Delay = 1,

  [switch]$Force
)

Add-Type -AssemblyName System.Windows.Forms

# ─ 1. Resolve paths ───────────────────────────────────────────
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
  Write-Host "  [AUTO-NEXT] Error: Not in a git repository." -ForegroundColor Red
  exit 1
}

$assistPath = Join-Path $repoRoot "ASSIST"
$checklistsPath = Join-Path $assistPath "Execution\checklists"
$masterplanPath = Join-Path $assistPath "Roadmap\masterplan.md"

# ── 2. Analyze checklists for remaining work ───────────────────
function Get-RemainingTasks {
  param([string]$ChecklistPath)

  if (-not (Test-Path $ChecklistPath)) { return 0 }

  $content = Get-Content $ChecklistPath -Raw
  # Count unchecked items: "- [ ]" or "🔲"
  $unchecked = ([regex]::Matches($content, '- \[ \]')).Count
  $unchecked += ([regex]::Matches($content, '🔲')).Count
  return $unchecked
}

$totalRemaining = 0
$checklistSummary = @()

if (Test-Path $checklistsPath) {
  $checklists = Get-ChildItem $checklistsPath -Filter "*.md"
  foreach ($cl in $checklists) {
    $remaining = Get-RemainingTasks -ChecklistPath $cl.FullName
    $totalRemaining += $remaining
    $name = $cl.Name -replace '\.md$', ''
    $checklistSummary += "    $name : $remaining remaining"
  }
}

# ── 3. Check masterplan for active phase ───────────────────────
$activePhase = ""
$phaseStatus = ""
if (Test-Path $masterplanPath) {
  $mp = Get-Content $masterplanPath -Raw
  if ($mp -match 'Active Phase:\s*(.+)') {
    $activePhase = $Matches[1].Trim()
  }
  if ($mp -match 'Combined.*\*\*(\d+\.?\d*)%\*\*') {
    $phaseStatus = $Matches[1] + "%"
  }
}

# ── 4. Decision engine ─────────────────────────────────────────
Write-Host ""
Write-Host "  [AUTO-NEXT] Analyzing project state..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Task Status:" -ForegroundColor White
foreach ($line in $checklistSummary) {
  Write-Host $line -ForegroundColor Gray
}
Write-Host "    Total remaining: $totalRemaining tasks" -ForegroundColor $(if ($totalRemaining -gt 0) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "  Phase: $activePhase ($phaseStatus)" -ForegroundColor White
Write-Host ""

$shouldTypeNext = $Force -or ($totalRemaining -gt 0)

if (-not $shouldTypeNext) {
  Write-Host "  [AUTO-NEXT] No remaining tasks detected." -ForegroundColor Yellow
  Write-Host "    All checklists appear complete." -ForegroundColor Yellow
  Write-Host "    Skipping auto-next." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "  Use -Force flag to override: .\auto-next.ps1 -Force" -ForegroundColor Gray
  Write-Host ""
  exit 0
}

# ── 5. Check active window (optional safety) ──────────────────
$activeWindow = Get-Process | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object -First 1
if ($activeWindow) {
  $windowTitle = $activeWindow.MainWindowTitle
  # Check if it looks like a chat/terminal/editor window
  $isChatWindow = $windowTitle -match '(opencode|terminal|powershell|cmd|chrome|edge|firefox|vscode|cursor|warp|tabby|alacritty|iterm|ghostty|chat|ai)' -or
                  $windowTitle -match '(NEOT|next\.js|localhost)'

  if (-not $isChatWindow) {
    Write-Host "  [AUTO-NEXT] Active window: '$windowTitle'" -ForegroundColor Yellow
    Write-Host "    Doesn't look like a chat/terminal window." -ForegroundColor Yellow
    Write-Host "    You have 5 seconds to switch to the chat window..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
  }
}

# ── 6. Execute ─────────────────────────────────────────────────
Write-Host "  [AUTO-NEXT] $totalRemaining tasks remaining - typing 'Next' in $Delay second(s)..." -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds $Delay

Write-Host "  [AUTO-NEXT] Typing 'Next'..." -ForegroundColor Cyan

# Use WScript.Shell for more reliable key simulation
$wshell = New-Object -ComObject WScript.Shell

# Small delay to ensure focus is ready
Start-Sleep -Milliseconds 300

# Type "Next"
$wshell.SendKeys("Next")

# Wait for send button to appear/activate
Write-Host "  [AUTO-NEXT] Waiting for send button to activate..." -ForegroundColor Cyan

# Wait for UI to process the text and enable send button
Start-Sleep -Seconds 2

# Use Tab to navigate to send button, then Enter
# This is more reliable than UI Automation for web-based chat interfaces
$wshell.SendKeys("{TAB}")
Start-Sleep -Milliseconds 300

# Press Enter to activate the focused send button
$wshell.SendKeys("{ENTER}")
Start-Sleep -Milliseconds 200

# Fallback: Try tilde as alternative Enter
$wshell.SendKeys("~")

Write-Host "  [AUTO-NEXT] Done - 'Next' sent." -ForegroundColor Green
Write-Host ""
