---
name: bump-semver-from-changes
description: 'Bump package.json version using semantic versioning by inspecting current changed files. Use when asked to "bump version", "increment package version", "apply semver bump", or "update package.json version from changed files". Detects changed files from git diff, chooses major/minor/patch with path-based rules, updates package.json (and lockfile when present), and stages the result.'
---

# Bump Semver From Changed Files

Automatically choose and apply a semantic version bump based on the files currently changed in git.

## When to Use This Skill

- User asks to bump `package.json` version based on current code changes
- User wants a semver bump but has not chosen `major`/`minor`/`patch`
- User asks for automated versioning from the current diff

## Rules for Choosing the Bump

Decide severity from highest matching rule:

1. `major`:
- Any breaking-change signal in commit text or diff (`BREAKING CHANGE`, `feat!`, `fix!`)
- Any changed file under compatibility-sensitive contracts:
`openapi/**`, `graphql/schema*`, `proto/**`, `prisma/migrations/**`, `src/contracts/**`, `src/types/public/**`

2. `minor`:
- Any product/runtime feature code changed:
`src/**`, `app/**`, `server/**`, `routes/**`
- But only when `major` rules do not match

3. `patch`:
- Only docs/tests/chore/config/build files changed:
`docs/**`, `**/*.md`, `test/**`, `**/*.test.*`, `.github/**`, config files, lint/format configs

If no rule clearly matches, default to `patch` and state that this was a conservative fallback.

Use the following command to determine the current version:

```bash
npm pkg get version
```

## Workflow

### 1) Determine Changed Files

Prefer staged changes. If nothing is staged, use working-tree changes.

```bash
git diff --name-only --cached
git diff --name-only
```

Use the first non-empty list as the input file set.

### 2) Compute the Recommended Bump

Evaluate rules in `major -> minor -> patch` order and pick the first match.

Always show:
- the chosen bump (`major`/`minor`/`patch`)
- the exact files that triggered the decision
- any assumptions made

### 3) Confirm If Decision Is High Risk

For `major`, require explicit confirmation before applying.

For `minor` and `patch`, proceed unless user asked to review first.

### 4) Apply the Version Update

Use npm so version formatting stays valid:

```bash
npm version <major|minor|patch> --no-git-tag-version
```

This updates `package.json` and usually `package-lock.json` when present.

If lockfile exists and was not updated, run:

```bash
npm install --package-lock-only
```

### 5) Stage Version Files

```bash
git add package.json package-lock.json 2>/dev/null || git add package.json
```

### 6) Report Result

Report:
- previous version -> new version
- selected bump and why
- files updated and staged

## Guardrails

- Never downgrade versions.
- Never modify unrelated files.
- If `package.json` is missing or invalid, stop and report the error.
- If no changed files exist, do not bump automatically; ask user whether to apply `patch`.
