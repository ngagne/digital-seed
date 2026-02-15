---
name: add-changelog-entry
description: 'Add a new changelog entry to changelog.md using the Keep a Changelog 1.1.0 format. Use when asked to add/update changelog entries, create changelog.md if missing, or document release notes for the current package version. Pulls version from `npm pkg get version`, uses current date in YYYY-MM-DD, inserts a new version section at the top, and never uses an Unreleased section.'
---

# Add Changelog Entry

Add a new release entry to `changelog.md` that follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).

## Workflow

### 1) Read Version and Date

Get the current package version and date:

```bash
VERSION=$(npm pkg get version | tr -d '"')
TODAY=$(date +%F)
```

Use this heading format:

```markdown
## [${VERSION}] - ${TODAY}
```

### 2) Ensure `CHANGELOG.md` Exists

If `CHANGELOG.md` does not exist, create it with this header:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
```

Do not create or add an `Unreleased` section.

### 3) Insert a New Entry at the Top

Insert the new version block directly after the introductory header text and before any existing version entries.

Use only relevant Keep a Changelog categories:
- `Added`
- `Changed`
- `Deprecated`
- `Removed`
- `Fixed`
- `Security`

Do not include empty categories.

### 4) Add Bullets for Changes

For each category used, add concise bullets:

```markdown
### Added

- Add user profile export endpoint

### Fixed

- Fix rate limit reset header for burst traffic
```

### 5) Prevent Duplicate Version Headings

Before inserting, check whether `## [${VERSION}] - ${TODAY}` already exists.

- If it exists: append/update bullets under the existing section.
- If it does not exist: insert a new section.

### 6) Stage Changelog File

```bash
git add CHANGELOG.md
```

## Guardrails

- Always target `CHANGELOG.md`.
- Preserve existing entries and ordering (newest first).
- Keep date format strictly `YYYY-MM-DD`.
- Never add `## [Unreleased]`.
- Keep entries factual and scoped to actual changes.
