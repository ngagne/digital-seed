# Seed Project Update - Templates

This folder contains template files for configuring the seed project update workflow.

## `.seedignore-template`

Use this template to configure which files and lines should be excluded during seed updates.

### How to Use

1. Copy `.seedignore-template` to your project root:
   ```bash
   cp .github/skills/update-seed-project/templates/.seedignore-template .seedignore
   ```

2. Edit `.seedignore` and customize the patterns based on your project:
   - Specify full file paths: `README.md`, `config/.env.local`
   - Use wildcards for patterns: `*.local`, `scripts/setup-*.sh`
   - Add comments with `#` prefix

3. Mark lines in your source files to preserve them:
   ```bash
   # Example in ./husky/pre-commit
   # SEED-IGNORE-START
   node ./version-check.js  # Your custom check
   # SEED-IGNORE-END
   
   npm lint  # This line will be updated from seed
   ```

4. Run the update script:
   ```bash
   bash .github/skills/update-seed-project/scripts/update-from-seed.sh --exclude-config .seedignore
   ```

### Pattern Rules

- **Exact matches**: `README.md` matches only that file
- **Wildcards**: `*.local` matches all files ending in `.local`
- **Paths**: `config/.env` matches `.env` files in the `config` directory
- **Regex patterns**: Use standard grep patterns
- **Comments**: Lines starting with `#` are ignored
- **Blank lines**: Empty lines are ignored

### Special Markers

Use `SEED-IGNORE-START` and `SEED-IGNORE-END` comments to protect specific lines in files:

```javascript
// SEED-IGNORE-START
const CUSTOM_API_KEY = process.env.CUSTOM_API_KEY;
// SEED-IGNORE-END

// The following lines can be updated from seed
const API_ENDPOINT = process.env.API_ENDPOINT;
```

During merge, lines between markers are preserved from your current branch.
