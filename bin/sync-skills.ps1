$ErrorActionPreference = 'Stop'

try {
  $rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
  $tmpDir = Join-Path $rootDir '.tmp-skills'
  $targetDir = Join-Path $rootDir '.github/skills'
  $repoUrl = 'https://github.com/ngagne/digital-seed.git'

  Write-Host 'Starting skills sync...'

  if (Test-Path -LiteralPath $tmpDir) {
    Remove-Item -LiteralPath $tmpDir -Recurse -Force
  }
  New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null

  & git clone $repoUrl $tmpDir
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: git clone $repoUrl $tmpDir"
  }

  $repoSkillsDir = Join-Path $tmpDir '.github/skills'
  $sourceDir = if (Test-Path -LiteralPath $repoSkillsDir -PathType Container) {
    $repoSkillsDir
  } else {
    $tmpDir
  }

  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

  $added = [System.Collections.Generic.List[string]]::new()
  $replaced = [System.Collections.Generic.List[string]]::new()

  $entries = Get-ChildItem -LiteralPath $sourceDir -Force
  foreach ($entry in $entries) {
    $destinationPath = Join-Path $targetDir $entry.Name
    if (Test-Path -LiteralPath $destinationPath) {
      $replaced.Add($entry.Name)
    } else {
      $added.Add($entry.Name)
    }

    Copy-Item -LiteralPath $entry.FullName -Destination $destinationPath -Recurse -Force
  }

  if (Test-Path -LiteralPath $tmpDir) {
    Remove-Item -LiteralPath $tmpDir -Recurse -Force
  }

  Write-Host 'Skills sync completed successfully.'

  Write-Host 'Added skills:'
  if ($added.Count -eq 0) {
    Write-Host '  (none)'
  } else {
    foreach ($name in $added) {
      Write-Host "  - $name"
    }
  }

  Write-Host 'Replaced skills:'
  if ($replaced.Count -eq 0) {
    Write-Host '  (none)'
  } else {
    foreach ($name in $replaced) {
      Write-Host "  - $name"
    }
  }
} catch {
  Write-Error $_
  exit 1
}
