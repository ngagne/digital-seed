---
name: run-unit-tests
description: 'Execute unit tests using npm test and report pass/fail status with full output. Use when asked to "run tests", "execute tests", "run unit tests", "/test", or "check if tests pass". Reports test results clearly without attempting to fix errors.'
---

# Run Unit Tests

A skill for executing unit tests and reporting results. Runs `npm test` command, captures output, and clearly reports whether tests passed or failed.

## When to Use This Skill

- User asks to "run tests" or "execute unit tests"
- User wants to verify test status during development
- User needs to check if changes broke any tests
- User types `/test` command
- User wants a pass/fail report with full output

## Prerequisites

- npm installed with Node.js
- `package.json` with test script configured
- Tests set up in the project

## Step-by-Step Workflow

### Step 1: Run the Test Command

Execute `npm test` in the project root directory.

### Step 2: Capture Output

Collect all output from the test execution, including:
- Test framework output (e.g., Jest, Mocha results)
- Pass/fail counts
- Error messages (if any)
- Summary statistics

### Step 3: Report Results

Provide a clear report with:
- **Status**: ✅ PASSED or ❌ FAILED
- **Summary**: Number of tests passed/failed/skipped
- **Full Output**: Complete command output for reference
- **Exit Code**: The npm test exit code

### Step 4: Do NOT Attempt Fixes

- Report findings only
- Do NOT modify code to fix failures
- Do NOT suggest changes
- Let user decide next action

## Example Output Format

```
✅ PASSED

Summary:
- Tests Run: 42
- Passed: 42
- Failed: 0
- Skipped: 0

Full Output:
[complete test output here]
```

Or:

```
❌ FAILED

Summary:
- Tests Run: 42
- Passed: 39
- Failed: 3
- Skipped: 0

Full Output:
[complete test output here]

Failed Tests:
- test/routes/api/users/users.test.ts
- test/routes/api/tasks/tasks.test.ts
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| npm test command not found | Ensure `test` script exists in package.json |
| Tests fail to run | Check that all dependencies are installed with `npm install` |
| Unclear results | Review the full output provided in the report |

## References

- npm test documentation: https://docs.npmjs.com/cli/v10/commands/npm-test/
