---
name: ensure-unit-tests-pass
description: 'Orchestrate unit test verification and one-pass remediation by delegating to existing skills. Use when asked to "ensure tests pass", "make unit tests pass", "fix and rerun tests", "stabilize test suite", or "/ensure-tests". Runs unit tests, fixes failures once, reruns tests, then reports success or stops and reports remaining failures.'
---

# Ensure Unit Tests Pass

A workflow skill that coordinates existing test-related skills to enforce a strict flow:
1) run tests, 2) fix failures once if needed, 3) rerun tests, 4) stop and report outcome.

## Orchestration Workflow

### Step 1: Run Unit Tests

Invoke the `run-unit-tests` skill.

- If tests pass: report success and stop.
- If tests fail: continue to Step 2.

### Step 2: Fix Failing Tests

Invoke the `fix-unit-test-failures` skill and provide the failure output from Step 1.

- Apply targeted source-code fixes.
- Do not change the workflow order.
- After fixes are applied, continue to Step 3.

### Step 3: Re-run Unit Tests

Invoke the `run-unit-tests` skill again.

- If tests pass: report success and include what was fixed.
- If tests still fail: continue to Step 4.

### Step 4: Stop and Report Remaining Failures

Stop after this second test run. Do not continue fixing in a loop.

Report:
- test status as failed,
- key remaining failing tests/errors,
- files changed during the attempted fix.

## Guardrails

- Perform at most one fix attempt per invocation of this skill.
- Preserve existing behavior outside the minimum required fixes.
- Do not claim success unless the final test run passes.
- Always include clear pass/fail status in the final report.
