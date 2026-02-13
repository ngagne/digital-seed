---
name: commit
description: 'Automate standardized git commits with Conventional Commits specification, semantic versioning, and changelog management. Use when user asks to commit changes, create a git commit, or mentions "/commit". Features: Auto-detects commit type and scope from diffs, extracts Jira IDs from branch names, bumps version numbers using semantic versioning rules, automatically updates CHANGELOG.md, and interactively handles breaking changes.'
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

### 3. Version and Changelog Management

Before committing, handle versioning and changelog updates:

#### Step 3a: Check Version in Staged Changes

```bash
# Check if package.json version was modified
git diff --staged package.json | grep '"version"'
```

If the version **was not changed**, determine the appropriate version bump using semantic versioning:

| Commit Type | Version Bump | Example      |
| ----------- | ------------ | ------------ |
| `feat`      | Minor        | 1.0.0 → 1.1.0 |
| `fix`       | Patch        | 1.0.0 → 1.0.1 |
| `perf`      | Patch        | 1.0.0 → 1.0.1 |
| `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore` | Patch | 1.0.0 → 1.0.1 |
| `revert`    | Patch        | 1.0.0 → 1.0.1 |
| Breaking change (feat! or fix!) | Major   | 1.0.0 → 2.0.0 |

**Important: Check for Breaking Changes**

If the commit type includes `!` (e.g., `feat!:` or `fix!:`), a breaking change has been detected. When this occurs:

1. **Alert the user** that a breaking change was detected
2. **Show the breaking change reference** from the commit message or description
3. **Present options**:
   - Bump MAJOR version (recommended for breaking changes)
   - Bump MINOR version (not recommended but allowed)
   - Cancel the commit

```bash
# Example prompt for breaking change
echo "⚠️  BREAKING CHANGE DETECTED!"
echo ""
echo "Breaking change: <description from commit message>"
echo ""
echo "Semantic Versioning requires a MAJOR version bump for breaking changes."
echo ""
echo "Options:"
echo "1) Bump MAJOR version (e.g., 1.0.0 → 2.0.0) - if breaking change"
echo "2) Bump MINOR version (e.g., 1.0.0 → 1.1.0) - if false positive"
echo "3) Cancel commit"
read -p "Enter your choice [1-3]: " choice

case $choice in
  1) echo "Bumping MAJOR version..." ;;
  2) echo "Bumping MINOR version..." ;;
  3) echo "Commit cancelled." && exit 1 ;;
  *) echo "Invalid choice. Commit cancelled." && exit 1 ;;
esac
```

- **Choice 1 (MAJOR)**: Update to next major version (e.g., 1.5.3 → 2.0.0)
- **Choice 2 (MINOR)**: Update to next minor version with warning message (e.g., 1.5.3 → 1.6.0)
- **Choice 3 (CANCEL)**: Exit the skill and cancel the commit

**Update package.json and package-lock.json** with the new version and stage the changes:

```bash
# Edit package.json to update the version field
# Then update package-lock.json with the same version
# Finally stage both files
git add package.json package-lock.json
```

If the version **was already changed**, proceed to the next step.

#### Step 3b: Update CHANGELOG.md

```bash
# Check if CHANGELOG.md exists
[ ! -f CHANGELOG.md ] && cat > CHANGELOG.md <<'EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
EOF
```

1. **Read the current version** from package.json (after any version bump)
2. **Get today's date** in YYYY-MM-DD format
3. **Add a new version section** at the top with the format: `## [VERSION] - DATE`
4. **Add appropriate subsections** (Added, Changed, Fixed, etc.) based on commit types
5. **Add bullet points** for each change using the commit description (without Jira ID)

Example CHANGELOG.md:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-12

### Added
- Two-factor authentication support
- New API endpoint for user preferences

### Fixed
- Race condition in batch processor
```

6. **Stage the CHANGELOG.md** update:

```bash
git add CHANGELOG.md
```

### 4. Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: What area/module is affected?
- **Description**: One-line summary of what changed (present tense, imperative mood, <72 chars)

If on a feature/* branch, extract the Jira ID from the branch name: `feature/[JIRA_ID]-description`. For example, if the branch name is `feature/ASDF-1357-do-something`, "ASDF-1357" is the Jira ID.

### 5. Execute Commit

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

The commit will include the code changes, version bump, and CHANGELOG.md updates.

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep description under 72 characters

## Changelog Updates

When committing changes, automatically update `CHANGELOG.md` in the root project directory and bump the version in `package.json` following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standard and [Semantic Versioning](https://semver.org/).

### CHANGELOG.md Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-12

### Added
- New features here

### Changed
- Changes in existing functionality here

### Deprecated
- Soon-to-be removed features here

### Removed
- Removed features here

### Fixed
- Bug fixes here

### Security
- Security vulnerability fixes here

## [1.0.0] - 2026-01-01

### Added
- Initial release
```

### Version Bumping Rules (Semantic Versioning)

Given a version MAJOR.MINOR.PATCH:

- **Major (X.0.0)**: Breaking changes indicated by `!` in commit type (e.g., `feat!:` or `fix!:`)
- **Minor (x.Y.0)**: New features (`feat` type)
- **Patch (x.y.Z)**: Bug fixes, performance improvements, documentation, refactoring, tests, build/CI, chore

### Mapping Commit Types to Changelog Sections

| Commit Type | Changelog Section | Version Bump |
| ----------- | ----------------- | ------------ |
| `feat`      | Added             | Minor        |
| `fix`       | Fixed             | Patch        |
| `perf`      | Changed           | Patch        |
| `docs`      | Changed           | Patch        |
| `style`     | Changed           | Patch        |
| `refactor`  | Changed           | Patch        |
| `test`      | Changed           | Patch        |
| `build`     | Changed           | Patch        |
| `ci`        | Changed           | Patch        |
| `chore`     | Changed           | Patch        |
| `deprecate` | Deprecated        | Patch        |
| `security`  | Security          | Minor or Major |
| `revert`    | Removed           | Patch        |

### Workflow for Changelog and Version Updates

1. **Check package.json version status**: Compare current version to staged changes
2. **Bump version if needed**: If not already updated, bump based on commit type and semantic versioning rules
3. **Update both package.json and package-lock.json**: Keep version numbers in sync across both files
4. **Create or update CHANGELOG.md**: Add new version entry with today's date
5. **Add appropriate sections**: Include only sections that have changes (Added, Fixed, Changed, etc.)
6. **Stage all files**: Add package.json, package-lock.json, and CHANGELOG.md to the commit

### Example: Updating CHANGELOG.md and package.json

**Current state**: package.json version is "1.0.0", no CHANGELOG.md exists

**Commit**: `PROJ-123: feat(auth): add two-factor authentication`

**Actions**:
1. Version not in staged changes → bump minor version to "1.1.0" in package.json and package-lock.json
2. Create CHANGELOG.md with entry:

```markdown
## [1.1.0] - 2026-02-12

### Added
- Two-factor authentication support
```

3. Stage all files and commit

**Result**: Commit includes package.json (1.0.0 → 1.1.0), package-lock.json (1.0.0 → 1.1.0), new CHANGELOG.md, and code changes

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix and create NEW commit (don't amend)
- Version and CHANGELOG.md updates should be included in the same commit as the code changes
- Only bump the version if it wasn't already updated in the staged changes