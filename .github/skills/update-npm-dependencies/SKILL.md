---
name: update-npm-dependencies
description: 'Update npm dependencies with test and release guardrails. Use when asked to update dependencies, run npm update with guardrails, or refresh package versions while preserving test stability. Executes in order: (1) ensure-unit-tests-pass, (2) npm update, (3) npm audit --fix, (4) ensure-unit-tests-pass, (5) release.'
---

# Update NPM Dependencies

Update dependencies with a test-gated workflow to catch regressions introduced by package upgrades.

## Workflow

### 1) Execute `ensure-unit-tests-pass`

- Run the `ensure-unit-tests-pass` skill first to verify a clean baseline.
- If this step fails, stop and report failures before attempting dependency updates.

### 2) Run `npm update`

Execute:

```bash
npm update
```

- Allow `package-lock.json` to update as needed.
- Do not skip this command.

### 3) Run `npm audit --fix`

Execute:

```bash
npm audit --fix
```

### 4) Re-execute `ensure-unit-tests-pass`

- Run `ensure-unit-tests-pass` again after `npm update` and `npm audit --fix`.
- If tests fail after the update, stop and report failures and changed files.

### 5) Execute `release`

- Run the `release` skill after dependency updates and post-update tests succeed.

## Guardrails

- Do not reorder steps.
- Do not run `npm update` if pre-update tests are failing.
- Do not run `release` unless post-update tests pass.
- Do not claim success unless all steps complete.
