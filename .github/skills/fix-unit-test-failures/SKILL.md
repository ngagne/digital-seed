---
name: fix-unit-test-failures
description: 'Analyze failing unit tests and apply fixes to source code without executing tests. Use when asked to "fix test failures", "debug failing tests", "fix broken tests", "/fix-tests", or "apply test fixes". Identifies root causes, proposes solutions, and implements code changes.'
---

# Fix Unit Test Failures

A skill for analyzing failing unit tests and automatically applying fixes to source code. Identifies root causes of failures, proposes solutions, and implements corrections without re-running tests.

## When to Use This Skill

- User provides failing test output and wants fixes applied
- User asks to "fix test failures" or "resolve broken tests"
- User wants automated test error remediation
- User types `/fix-tests` command
- User has test failures and needs root cause analysis with solutions
- User wants to understand why tests fail and apply targeted fixes

## Prerequisites

- Test failure output available (from `npm test` or similar)
- Access to test files and corresponding source code
- Understanding of the test framework and assertion types
- Source code that requires modification

## Step-by-Step Workflow

### Step 1: Analyze the Test Failure

Review the provided test failure output:
- Identify which test(s) failed
- Extract the assertion error message
- Determine what was expected vs. actual
- Note the stack trace to locate failing code

### Step 2: Examine the Test File

Read the failing test code to understand:
- What the test is checking
- What conditions it expects
- What inputs it provides
- The assertion that failed

### Step 3: Review the Source Code

Examine the source file being tested to:
- Understand the current implementation
- Identify what's incorrect or missing
- Determine what changes are needed
- Check for type errors, logic errors, or missing features

### Step 4: Propose the Fix

For each failure, describe:
- **Root Cause**: Why the test is failing
- **Fix**: Specific code change needed
- **Explanation**: Why this fixes the issue

### Step 5: Apply the Fix

- Modify the source code files
- Ensure fixes are minimal and targeted
- Do NOT modify test files (unless absolutely necessary for test data)
- Preserve existing functionality

### Step 6: Report Results

Document what was fixed:
- List all files modified
- Describe each fix applied
- Explain how each fix addresses the failing test
- Note any edge cases or considerations

## Example Analysis and Fix

### Failing Test Output

```
✖ should return user profile with valid ID
  AssertionError: Expected status 200 but got 404
```

### Analysis

1. **Test expects**: `/api/users/:id` returns 200 with user data
2. **Actual result**: Returns 404 Not Found
3. **Root cause**: User ID validation logic is rejecting valid IDs

### Fix Proposed

In `src/routes/users/index.ts`:
- Update ID validation regex to accept valid format
- Ensure database lookup uses correct query
- Verify user exists before returning profile

### Fix Applied

```typescript
// Before
if (!id.match(/^\d{1,3}$/)) return reply.notFound();

// After  
if (!id.match(/^\d+$/)) return reply.notFound();
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot locate failing code | Review the stack trace for file path and line number |
| Multiple related failures | Fix root cause first, other failures may resolve |
| Unclear what test expects | Read test name and assertions carefully |
| Fix breaks other tests | Reconsider approach, may need broader changes |
| Cannot modify source (permission) | Report the issue and required changes instead |

## Important Notes

- **Do NOT re-run tests** after applying fixes
- **Do NOT modify test files** to make them pass
- Focus on fixing the **source code**, not tests
- Apply minimum necessary changes
- Preserve code style and patterns
- Consider side effects of changes

## References

- Test framework documentation: https://nodejs.org/api/test.html
- Common assertion errors: https://nodejs.org/api/assert.html
- Debugging guide: https://nodejs.org/en/docs/guides/debugging-getting-started/
