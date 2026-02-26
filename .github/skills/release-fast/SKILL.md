---
name: release-fast
description: 'Fast release workflow with optimized git and npm operations. Use when asked to "release fast", "quick release", or "expedite a release". Executes version bump, changelog update, and commit in sequence with batched file operations to minimize redundant git/npm calls. Optimized for performance over the standard release skill.'
---

# Release Fast

Prepare a release with optimized performance by batching git operations and minimizing redundant npm calls.

## Performance Optimizations

This skill improves upon the standard `release` skill by:
- **Single git status check** instead of repeated `git diff` / `git status` calls
- **Cached version across steps** (no redundant `npm pkg get version` calls)
- **Batched file staging** (single `git add` instead of multiple calls)
- **Streamlined prompts** (skip confirmation for patch/minor bumps)

Expected reduction: ~40% fewer git/npm operations.

## Workflow

### 1) Verify and Stage Changes

```bash
# Single combined check
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null)

if [[ -z "$STAGED_FILES" ]]; then
  # Prompt user:
  # 1) Stage all changes with `git add -A` and continue
  # 2) Cancel the release workflow
  # If cancel: stop immediately
  git add -A
fi
```

### 2) Determine Bump Type and Apply

**Analyze staged files against bump rules**:

1. `major`: breaking-change signals or contract changes
   - `BREAKING CHANGE`, `feat!`, `fix!` in recent commits
   - Files: `openapi/**`, `graphql/schema*`, `proto/**`, `prisma/migrations/**`, `src/contracts/**`, `src/types/public/**`

2. `minor`: product/runtime feature code
   - Files: `src/**`, `app/**`, `server/**`, `routes/**`

3. `patch`: docs/tests/config/build only
   - Files: `docs/**`, `**/*.md`, `test/**`, `**/*.test.*`, `.github/**`, config files

**Apply version bump**:

```bash
OLD_VERSION=$(npm pkg get version | tr -d '"')
npm version <major|minor|patch> --no-git-tag-version
NEW_VERSION=$(npm pkg get version | tr -d '"')
```

**Report**: `OLD_VERSION -> NEW_VERSION (reason: files matched <rule>)`

### 3) Update Changelog

Using the already-captured `NEW_VERSION` (no npm call needed):

```bash
TODAY=$(date +%F)
ENTRY_HEADING="## [$NEW_VERSION] - $TODAY"
```

**Steps**:
- Read `CHANGELOG.md` (create if missing with Keep a Changelog header)
- Check if entry already exists for `$NEW_VERSION`
- If not, insert new section after intro header
- Add change categories based on staged file types:
  - Files in `src/` or `app/` → `Added` / `Changed` / `Fixed` / `Removed`
  - Files in `.github/skills/*` → reference skill changes
  - Files in `bin/`, `build/`, scripts → `Added` (new tools)
  - Files in `docs/`, `*.md` → `Changed` (documentation)

### 4) Stage All Release Files at Once

```bash
git add package.json package-lock.json CHANGELOG.md 2>/dev/null || \
git add package.json CHANGELOG.md
```

Or if additional files were in the initial staged set, include them:

```bash
git add $STAGED_FILES package.json package-lock.json CHANGELOG.md 2>/dev/null || \
git add $STAGED_FILES package.json CHANGELOG.md
```

### 5) Create Release Commit

Analyze committed changes to build a conventional commit message:

```bash
# Extract Jira ID from branch if on feature branch
BRANCH=$(git branch --show-current)
JIRA_ID=""
if [[ $BRANCH =~ ^feature/([A-Z]+-[0-9]+) ]]; then
  JIRA_ID="${BASH_REMATCH[1]}: "
fi

# Build message from staged content
# Format: <jira>: <type>[scope]: <description>
git commit -m "${JIRA_ID}chore(release): bump version to $NEW_VERSION"
```

## Guardrails

- Do not reorder steps.
- If step 1 exits by user choice (cancel), stop immediately.
- If step 2 fails to apply version, stop and report the error.
- If step 3 fails to update changelog (invalid CHANGELOG.md), stop and report the error.
- Always include `package.json`, `package-lock.json`, and `CHANGELOG.md` in final staging.
- Commit only after all staging is confirmed.

## When to Use `release-fast` vs `release`

| Scenario | Use |
|----------|-----|
| Standard release, no urgency | Either |
| CI/CD pipeline, many releases | `release-fast` (fewer operations) |
| Complex multi-skill release | `release` (more reliable orchestration) |
| Manual release, validation-heavy | `release` (better for reviewing each step) |
| Frequent patch releases | `release-fast` (optimized for speed) |

