---
name: commit
description: 'Automate standardized git commits with Conventional Commits specification. Use when user asks to commit changes, create a git commit, or mentions "/commit". Features: Auto-detects commit type and scope from diffs, extracts Jira IDs from branch names, and interactively handles breaking changes.'
allowed-tools: Bash
---

# Git Commit with Conventional Commits

## Overview

Create standardized, semantic git commits using the Conventional Commits specification. Analyze the actual diff to determine appropriate type, scope, and message.

## Conventional Commit Format

```
<jira id>: <type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Breaking Changes

```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint

# BREAKING CHANGE footer
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## Workflow

### 1. Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Also check status
git status --porcelain
```

### 2. Stage Files (if needed)

If nothing is staged or you want to group changes differently:

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add *.test.*
git add src/components/*

# Interactive staging
git add -p
```

**Never commit secrets** (.env, secrets.ini, credentials.json, private keys).

### 3. Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: What area/module is affected?
- **Description**: One-line summary of what changed (present tense, imperative mood, <72 chars)

Prioritize the files actually changed when writing the description. Do not use generic messages like "bump version to X" unless the diff is only a version bump.

Path-aware guidance:

- If changes include `.github/skills/*`, write a skill-focused message, e.g. `docs(skills): add release skill guidance` or `chore(skills): refine commit skill workflow`.
- If changes include both version files and feature/config/docs changes, describe the primary behavioral change, not the version bump.
- Use `chore(release): bump version to X` only when the commit is strictly release/version metadata updates.

If on a feature/* branch, extract the Jira ID from the branch name: `feature/[JIRA_ID]-description`. For example, if the branch name is `feature/ASDF-1357-do-something`, "ASDF-1357" is the Jira ID.

### 4. Execute Commit

```bash
# Single line
git commit -m "<jira id>: <type>[scope]: <description>"

# Multi-line with body/footer
git commit -m "$(cat <<'EOF'
<jira id>: <type>[scope]: <description>

<optional body>

<optional footer>
EOF
)"
```

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep description under 72 characters

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix and create NEW commit (don't amend)
