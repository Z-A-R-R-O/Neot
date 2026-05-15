#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Git commit helper for NEOT — stages all, auto-numbers, commits with format: XX -- NEOT -- <description>
.DESCRIPTION
  Stages all changes, reads existing commits to auto-increment the prefix number,
  and creates a commit: "XX -- NEOT -- <description>"
.EXAMPLE
  .\git-helper.ps1 "Add user login and auth middleware"
  # Creates: "05 -- NEOT -- Add user login and auth middleware"
#>

param(
  [Parameter(Position = 0)]
  [string]$Message = ""
)

$CommitPrefix = "NEOT"
$MaxPrefix = 999

# ── 1. Check git repo ───────────────────────────────────────────
Write-Host "  [GIT] Checking repository..." -ForegroundColor Cyan
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
  Write-Host "  Error: Not a git repository." -ForegroundColor Red
  exit 1
}
Write-Host "    Repo root: $repoRoot" -ForegroundColor Green

# ── 2. Status ───────────────────────────────────────────────────
Write-Host "  [STATUS] Checking working tree..." -ForegroundColor Cyan
$status = git status --porcelain
if (-not $status) {
  Write-Host "  Nothing to commit - working tree clean." -ForegroundColor Yellow
  exit 0
}

$modified = 0; $added = 0; $deleted = 0; $renamed = 0
foreach ($line in $status) {
  if ($line -match '^M')  { $modified++ }
  if ($line -match '^A' -or $line -match '^\?\?') { $added++ }
  if ($line -match '^D')  { $deleted++ }
  if ($line -match '^R')  { $renamed++ }
}

Write-Host "    Changes: +$added added  ~$modified modified  -$deleted deleted  $renamed renamed" -ForegroundColor Green
Write-Host ""
Write-Host "  Files:" -ForegroundColor White
foreach ($line in $status) {
  Write-Host "    $line" -ForegroundColor Gray
}
Write-Host ""

# ── 3. Diff summary ─────────────────────────────────────────────
Write-Host "  [DIFF] Changes summary (stat only):" -ForegroundColor Cyan
git diff --stat
Write-Host ""

# ── 4. Determine next number ───────────────────────────────────
Write-Host "  [NUMBER] Finding next commit number..." -ForegroundColor Cyan
$existingNumbers = @()
$logs = git log --oneline --format="%s"
foreach ($logLine in $logs) {
  if ($logLine -match "^(\d+)\s*--\s*$CommitPrefix") {
    $existingNumbers += [int]$Matches[1]
  }
}
$nextNum = 1
if ($existingNumbers.Count -gt 0) {
  $maxExisting = ($existingNumbers | Measure-Object -Maximum).Maximum
  $nextNum = $maxExisting + 1
  if ($nextNum -gt $MaxPrefix) {
    Write-Host "    Exceeded max prefix ($MaxPrefix). Wrapping to 1." -ForegroundColor Yellow
    $nextNum = 1
  }
}

$numStr = $nextNum.ToString("00")
Write-Host "    Next number: $numStr" -ForegroundColor Green

# ── 5. Commit message ──────────────────────────────────────────
$commitMsg = ""
$msgIsEmpty = [string]::IsNullOrEmpty($Message) -or $Message.Trim().Length -eq 0

if ($msgIsEmpty) {
  Write-Host "  [MESSAGE] Enter commit description (leave blank to cancel):" -ForegroundColor Cyan
  $description = Read-Host "  Description"
  $descIsEmpty = [string]::IsNullOrEmpty($description) -or $description.Trim().Length -eq 0
  if ($descIsEmpty) {
    Write-Host "    Commit cancelled - no description provided." -ForegroundColor Yellow
    exit 0
  }
  $commitMsg = "$numStr -- $CommitPrefix -- $description"
}
else {
  $commitMsg = "$numStr -- $CommitPrefix -- $Message"
}

Write-Host "  [SUMMARY] Commit message:" -ForegroundColor Cyan
Write-Host "    $commitMsg" -ForegroundColor Yellow
Write-Host ""

# ── 6. Confirm ─────────────────────────────────────────────────
$confirm = Read-Host "  Proceed with commit? (Y/n)"
if ($confirm -ne "" -and $confirm -ne "y" -and $confirm -ne "Y") {
  Write-Host "    Commit cancelled." -ForegroundColor Yellow
  exit 0
}

# ── 7. Stage and Commit ────────────────────────────────────────
Write-Host "  [COMMIT] Staging all changes..." -ForegroundColor Cyan
git add -A

Write-Host "  [COMMIT] Creating commit..." -ForegroundColor Cyan
git commit -m $commitMsg

if ($LASTEXITCODE -eq 0) {
  Write-Host "    Commit successful: $commitMsg" -ForegroundColor Green
  Write-Host ""
  Write-Host "  [NEXT] Push to remote?" -ForegroundColor Cyan
  $push = Read-Host "  Push now? (y/N)"
  if ($push -eq "y" -or $push -eq "Y") {
    $branch = git rev-parse --abbrev-ref HEAD
    Write-Host "  [PUSH] Pushing $branch..." -ForegroundColor Cyan
    git push origin $branch
    if ($LASTEXITCODE -eq 0) {
      Write-Host "    Push successful." -ForegroundColor Green
    }
    else {
      Write-Host "    Push failed (check remote config)." -ForegroundColor Yellow
    }
  }
}
else {
  Write-Host "  Commit failed." -ForegroundColor Red
  exit 1
}
