---
name: update-seed
description: 'Sync this project with the seed project by cloning seed to a temporary directory, applying seed changes with project-specific exclusions, installing dependencies, then running ensure-unit-tests-pass and release. Use when asked to "update seed", "sync from seed", "pull in seed template changes", or "/update-seed".'
---

# Update Seed

Synchronize the current project with a seed repository while preserving project-owned areas.

## Workflow

### 1) Clone seed repo into a temporary directory

Use a placeholder URL and clone into a temp directory:

```bash
SEED_URL="https://example.com/seed-repo.git"
SEED_TMP_DIR="$(mktemp -d)"
git clone "$SEED_URL" "$SEED_TMP_DIR"
```

Always clean up the temp directory when finished.

### 2) Apply seed changes with exclusions and special merge rules

Treat the seed clone as source of truth, then merge into the current project with these constraints.

Do not update these paths:
- Any file/dir matched by `.gitignore`
- `src/**/*`
- `test/**/*`
- `README.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `RUNBOOK.md`
- `package-lock.json`
- `Jenkinsfile`

For files not excluded:
- If a file exists in seed and current project: replace/add lines to match seed.
- If a file exists in seed but not current project: add it.

Special handling:
- `Dockerfile`: do not modify lines that reference `template-project` in seed. Keep current project content for those lines.
- `package.json`:
  - do not modify `name`, `description`, or `version`
  - do not downgrade dependencies (for both `dependencies` and `devDependencies`)

For content present in current project but not in seed:
- Before removing it, check git history for prior deletion using:

```bash
git log --diff-filter=D --summary -- <path/to/deleted_file.txt>
```

- If history shows it was removed, remove it.
- If not, leave it unchanged.

### 3) Install dependencies

Run:

```bash
npm install
```

### 4) Execute `ensure-unit-tests-pass` skill

Invoke the `ensure-unit-tests-pass` skill and follow its full workflow.

### 5) Execute `release` skill

Invoke the `release` skill after tests are passing.

## Guardrails

- Stop and report immediately if clone, merge, install, or test orchestration fails.
- Never force git operations.
- Never run destructive git commands unless explicitly requested.
- Preserve existing project-only customizations unless a deletion is confirmed by history check.
