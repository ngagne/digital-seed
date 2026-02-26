---
name: release
description: 'Run the full release preparation workflow by chaining existing skills. Use when asked to "release", "prepare a release", "cut a release commit", or "do release housekeeping". Executes skills in order: (1) bump-semver-from-changes, (2) add-changelog-entry, (3) commit.'
---

# Release

Prepare a release by executing the existing skills in this exact order.

## Workflow

### 1) Verify staged changes

- Check staged files before running release steps:
  - `git diff --staged --name-only`
  - `git status --porcelain`
- If there are no staged changes, prompt the user to choose one:
  - Stage all changes with `git add -A` and continue
  - Cancel the release workflow
- If the user chooses cancel, stop immediately.

### 2) Execute `bump-semver-from-changes`

- Run the `bump-semver-from-changes` skill first.
- Let it decide and apply the semver bump from current changes.
- Ensure `package.json` (and `package-lock.json` when applicable) are updated and staged.

### 3) Execute `add-changelog-entry`

- Run the `add-changelog-entry` skill after the version bump is complete.
- Use the bumped package version for the changelog heading and release entry.
- Ensure `changelog.md` is updated and staged.

### 4) Execute `commit`

- Run the commit skill last.
- Create a Conventional Commit that includes the release changes from steps 2 and 3.

## Guardrails

- Do not reorder steps.
- If step 1 exits by user choice (cancel), stop immediately.
- If step 2 fails, stop and report the error.
- If step 3 fails, stop and report the error.
- Commit only after successful version and changelog updates.
