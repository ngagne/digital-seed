---
name: update-seed-project
description: 'Update your project with latest changes from the digital-seed repository. Use when asked to "update my project", "sync with seed", "pull seed changes", or use the `/update-seed` command. Handles running baseline tests, fetching and merging seed changes, resolving conflicts, running tests, fixing failures, and pushing updates.'
---

# Update Seed Project

Synchronize your project with the latest changes from the digital-seed repository. This skill automates the entire workflow of merging upstream changes while maintaining code quality.

## When to Use This Skill

- User asks to "update my project" or "sync with seed"
- User invokes `/update-seed` command
- User mentions "pull changes from seed" or "merge seed updates"
- You need to bring this forked project up-to-date with the seed repository

## Prerequisites

- Git installed and configured
- Remote named `digital-seed` pointing to the seed repository (or permission to add it)
- Unit tests configured and passing in the baseline
- Administrative access to push changes to the main branch
- No uncommitted changes (will stash if necessary)

## Excluding Files and Lines

You may have project-specific files or lines that should not be overwritten by seed updates. Configure exclusions before merging:

### Method 1: Create a `.seedignore` Configuration (Recommended)

Create a `.seedignore` file in your project root with patterns for files or line markers to exclude:

```
# Files to exclude entirely (won't be updated from seed)
README.md
CHANGELOG.md
.env*

# Line markers for partial exclusion
# Use special comments in files to mark lines to preserve:
# SEED-IGNORE-START and SEED-IGNORE-END
```

For line-by-line exclusion, add markers in your source files:

```bash
# In ./husky/pre-commit (example)
# SEED-IGNORE-START
node ./version-check.js  # Your custom check
# SEED-IGNORE-END
npm lint
```

### Method 2: Use `.gitattributes` for Merge Strategy

Configure file-specific merge strategies in `.gitattributes`:

```gitattributes
README.md merge=ours
.env.example merge=ours
package.json merge=union
```

Then configure the merge strategy:

```bash
git config merge.ours.driver true
```

This keeps your version of files marked with `merge=ours`.

### Method 3: Manual Exclusion After Merge

After merging, manually restore excluded files to their pre-merge state:

```bash
# Restore main branch version before re-applying your changes
git checkout HEAD~1 -- README.md
# Then manually apply any seed features you want
```

### Recommended Workflow with Exclusions

1. Create `.seedignore` in your project
2. Use the helper script with `--exclude-config .seedignore` flag
3. The script will preserve marked files/lines during the merge
4. Manually review and merge any non-excluded seed updates

## Step-by-Step Workflow

### Step 1: Verify Baseline Health

Before syncing changes, establish a healthy baseline by running all unit tests:

```bash
npm test -- --watchAll=false
```

**What to look for:**
- All tests pass with no failures
- No TypeScript compilation errors
- No linting issues

If tests fail, address these issues before proceeding. This ensures you have a clean starting point to detect issues introduced by the merge.

### Step 2: Stash or Commit Uncommitted Changes

Check for uncommitted changes:

```bash
git status
```

If there are uncommitted changes, you have two options:
- **Commit them** with a conventional commit message
- **Stash them** using `git stash` to preserve for later

Recommendation: If changes are work-in-progress, stash them. If they're complete, commit them.

### Step 3: Add the Seed Remote (If Needed)

Check if the `digital-seed` remote exists:

```bash
git remote -v
```

If `digital-seed` is not listed, add it:

```bash
git remote add digital-seed <SEED_REPOSITORY_URL>
```

### Step 4: Fetch Updates from Seed

Fetch the latest changes without modifying your current branch:

```bash
git fetch digital-seed
```

This downloads all branches and their history from the seed repository.

### Step 5: Create a Feature Branch for the Merge

Create a dedicated branch for this merge operation:

```bash
git checkout -b merge/digital-seed-update
```

This isolates merge-related changes and allows you to review before merging back to main.

### Step 6: Merge Seed Changes

Merge the seed repository's main branch into your feature branch:

```bash
git merge digital-seed/main
```

**Expected outcomes:**
- **Fast-forward merge:** If no conflicts, changes are automatically merged
- **Merge conflicts:** Git will pause and mark conflicting files
- **Merge commit:** A new commit is created to record the merge

### Step 7: Resolve Merge Conflicts (If Present)

If conflicts exist, Git will mark them in the affected files. For each conflicted file:

1. **Identify conflicts:** Look for markers like:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Seed changes
   >>>>>>> digital-seed/main
   ```

2. **Decide on resolution:**
   - **Keep your version:** Remove the seed changes
   - **Accept seed changes:** Use the seed version
   - **Combine both:** Manually merge the logic from both versions

3. **Resolve manually in editor** by editing the file and removing conflict markers

4. **For complex conflicts**, use a merge tool:
   ```bash
   git mergetool
   ```

5. **Stage resolved files:**
   ```bash
   git add <resolved-file>
   ```

6. **Complete the merge:**
   ```bash
   git commit
   ```

### Step 7.5: Install dependencies

After merging and resolving conflicts, install any new or updated dependencies introduced by the seed repository:

```bash
npm i
```

Run this before running tests to ensure the environment matches the merged code.

### Step 8: Run Tests After Merge

After resolving conflicts, run all tests to verify the merge didn't break anything:

```bash
npm test -- --watchAll=false
```

### Step 9: Fix Failing Tests (If Any)

If tests fail:

1. **Identify failures:** Review the test output for error messages
2. **Root cause:** Determine if failure is due to:
   - Seed changes conflicting with your code
   - Your code changes conflicting with seed updates
   - Environmental issues

3. **Fix the issues:**
   - Update your code to be compatible with seed changes
   - Or revert problematic seed changes if they don't fit your project

4. **Re-run tests** to verify fixes:
   ```bash
   npm test -- --watchAll=false
   ```

### Step 10: Review Changes

Before pushing, review all changes in the merge:

```bash
git log --oneline main..HEAD
```

This shows commits in your branch that aren't in main yet.

View the diff:

```bash
git diff main
```

### Step 11: Merge Back to Main

Once tests pass and you've verified the changes:

```bash
git checkout main
git merge merge/digital-seed-update
```

### Step 12: Push Changes

Push the updated main branch to your remote:

```bash
git push origin main
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `digital-seed` remote not found | Run `git remote add digital-seed <URL>` with correct seed repo URL |
| Merge conflicts in multiple files | Use VS Code's merge conflict resolution UI or `git mergetool` |
| Tests fail after merge | Review seed changes in conflicting files and adapt your code accordingly |
| "Already up to date" message | Your project already has all seed changes |
| Uncommitted changes block merge | Stash or commit changes with `git stash` or `git commit` |
| Merge aborted mid-way | Run `git merge --abort` to cancel and start over |
| File keeps being overwritten | Add to `.seedignore` and use script with `--exclude-config` flag |
| Specific line got merged but shouldn't | Wrap with `SEED-IGNORE-START/END` markers and re-run merge |
| Want to restore excluded file temporarily | Run `git show digital-seed/main:path/to/file > temp-file.txt` to inspect seed version |

## Advanced: Automatic Merge Strategy

For non-conflicting merges or specific merge strategies:

```bash
# Use seed version for all conflicts
git merge -X theirs digital-seed/main

# Use your version for all conflicts
git merge -X ours digital-seed/main
```

**Warning:** Auto-merge strategies may hide important conflicts. Use cautiously and always verify with tests.

## References

- [Git Branching - Basic Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Merging)
- [Resolving Merge Conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)
- [Git Remote Reference](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
- [`.seedignore` Template](./templates/.seedignore-template) - Copy and customize for your project
- [Templates Guide](./templates/README.md) - Detailed configuration instructions
