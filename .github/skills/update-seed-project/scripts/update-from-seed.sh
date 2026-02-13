#!/bin/bash

# Update Seed Project Script
# Automates the process of fetching and merging changes from the digital-seed repository
# Supports excluding files and lines marked in .seedignore or using SEED-IGNORE markers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SEED_REMOTE="digital-seed"
SEED_BRANCH="main"
FEATURE_BRANCH="merge/digital-seed-update"
LOCAL_BRANCH="main"
EXCLUDE_CONFIG=".seedignore"
TEMP_DIR=$(mktemp -d)

# Cleanup temp directory on exit
trap "rm -rf $TEMP_DIR" EXIT

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --exclude-config)
            EXCLUDE_CONFIG="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}🌱 Starting Seed Project Update${NC}\n"

# Function to check if file should be excluded
should_exclude() {
    local file=$1
    if [ ! -f "$EXCLUDE_CONFIG" ]; then
        return 1
    fi
    
    while IFS= read -r pattern; do
        # Skip empty lines and comments
        [[ -z "$pattern" || "$pattern" =~ ^# ]] && continue
        # Remove surrounding whitespace
        pattern=$(echo "$pattern" | xargs)
        
        if [[ "$file" == "$pattern" ]] || [[ "$file" =~ $pattern ]]; then
            return 0
        fi
    done < <(grep -v "^#\|^$\|SEED-IGNORE" "$EXCLUDE_CONFIG" 2>/dev/null || true)
    
    return 1
}

# Function to restore excluded files to pre-merge state
restore_excluded_files() {
    if [ ! -f "$EXCLUDE_CONFIG" ]; then
        return
    fi
    
    echo -e "${BLUE}Restoring excluded files...${NC}"
    
    local count=0
    while IFS= read -r pattern; do
        # Skip empty lines and comments
        [[ -z "$pattern" || "$pattern" =~ ^# || "$pattern" =~ SEED-IGNORE ]] && continue
        
        pattern=$(echo "$pattern" | xargs)
        
        # Check if file exists and has changes
        if git diff "$FEATURE_BRANCH" HEAD -- "$pattern" &>/dev/null; then
            git checkout HEAD -- "$pattern" 2>/dev/null || true
            echo -e "${YELLOW}  ↶ Restored: $pattern${NC}"
            ((count++))
        fi
    done < "$EXCLUDE_CONFIG"
    
    if [ $count -gt 0 ]; then
        echo -e "${GREEN}✓ Restored $count excluded file(s)${NC}\n"
    fi
}

# Function to restore lines marked with SEED-IGNORE markers
restore_ignored_lines() {
    echo -e "${BLUE}Processing SEED-IGNORE markers...${NC}"
    
    local count=0
    while IFS= read -r file; do
        if [ -z "$file" ]; then
            continue
        fi
        
        # Check if file has SEED-IGNORE markers
        if ! grep -q "SEED-IGNORE" "$file" 2>/dev/null; then
            continue
        fi
        
        # Restore original lines from main branch
        if git show main:"$file" > "$TEMP_DIR/original" 2>/dev/null; then
            # Use awk to restore lines between markers
            awk '
                /SEED-IGNORE-START/ { in_ignore=1; print; next }
                /SEED-IGNORE-END/ { in_ignore=0; print; next }
                in_ignore { next }
                { print }
            ' "$TEMP_DIR/original" > "$TEMP_DIR/restored"
            
            # Replace file with restored version
            if ! diff -q "$file" "$TEMP_DIR/restored" &>/dev/null; then
                cp "$TEMP_DIR/restored" "$file"
                git add "$file"
                echo -e "${YELLOW}  ↶ Restored markers in: $file${NC}"
                ((count++))
            fi
        fi
    done < <(git diff --name-only --diff-filter=M "$FEATURE_BRANCH" HEAD 2>/dev/null || true)
    
    if [ $count -gt 0 ]; then
        echo -e "${GREEN}✓ Restored $count file(s) with markers${NC}\n"
    fi
}

# Step 1: Check for uncommitted changes
echo -e "${BLUE}Step 1: Checking for uncommitted changes...${NC}"
if [ -n "$(git status -s)" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    read -p "Stash changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git stash
        echo -e "${GREEN}✓ Changes stashed${NC}\n"
    else
        echo -e "${RED}✗ Aborting. Please commit or stash changes first.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Working directory clean${NC}\n"
fi

# Step 2: Show exclusion configuration if present
if [ -f "$EXCLUDE_CONFIG" ]; then
    echo -e "${BLUE}Step 2: Exclusion configuration found${NC}"
    echo -e "${YELLOW}Files/patterns to exclude:${NC}"
    grep -v "^#\|^$" "$EXCLUDE_CONFIG" | sed 's/^/  - /'
    echo ""
fi

# Step 3: Run baseline tests
echo -e "${BLUE}Step 3: Running baseline unit tests...${NC}"
if ! npm test -- --watchAll=false; then
    echo -e "${RED}✗ Tests failed${NC}"
    read -p "Would you like to fix the test failures now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Opening editor for fixes...${NC}"
        read -p "Press enter once you've fixed the tests in your editor... "
        
        # Re-run tests
        if npm test -- --watchAll=false; then
            read -p "Commit the test fixes? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git add .
                git commit -m "fix: resolve test failures before seed merge"
                echo -e "${GREEN}✓ Committed test fixes${NC}\n"
                # Restart from Step 4 (after re-running baseline test)
                echo -e "${BLUE}Step 3: Running baseline tests again...${NC}"
                npm test -- --watchAll=false
                echo -e "${GREEN}✓ All tests passed${NC}\n"
            fi
        else
            echo -e "${RED}✗ Tests still failing. Please fix remaining issues.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Aborting. Please fix baseline tests before proceeding.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ All tests passed${NC}\n"
fi

# Step 4: Ensure seed remote exists
echo -e "${BLUE}Step 4: Verifying seed remote...${NC}"
if ! git remote get-url $SEED_REMOTE > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Remote '$SEED_REMOTE' not found${NC}"
    read -p "Enter seed repository URL: " SEED_REPO_URL
    git remote add $SEED_REMOTE "$SEED_REPO_URL"
    echo -e "${GREEN}✓ Remote added${NC}\n"
else
    echo -e "${GREEN}✓ Remote exists${NC}\n"
fi

# Step 5: Fetch from seed
echo -e "${BLUE}Step 5: Fetching changes from $SEED_REMOTE...${NC}"
if git fetch $SEED_REMOTE; then
    echo -e "${GREEN}✓ Fetch successful${NC}\n"
else
    echo -e "${RED}✗ Fetch failed${NC}"
    exit 1
fi

# Step 6: Create feature branch
echo -e "${BLUE}Step 6: Creating feature branch...${NC}"
# Delete if exists
git branch -D $FEATURE_BRANCH 2>/dev/null || true
git checkout -b $FEATURE_BRANCH
echo -e "${GREEN}✓ Feature branch created: $FEATURE_BRANCH${NC}\n"

# Step 7: Merge seed changes
echo -e "${BLUE}Step 7: Merging seed changes...${NC}"
if git merge $SEED_REMOTE/$SEED_BRANCH; then
    echo -e "${GREEN}✓ Merge successful (no conflicts)${NC}\n"
else
    echo -e "${YELLOW}⚠️  Merge conflicts detected${NC}"
    echo "Resolve conflicts in your editor and run:"
    echo "  git add <resolved-files>"
    echo "  git commit"
    echo ""
    read -p "Press enter once conflicts are resolved... "
fi

# Step 8: Restore excluded files and lines
if [ -f "$EXCLUDE_CONFIG" ]; then
    restore_excluded_files
    restore_ignored_lines
    
    # Commit exclusion changes if any
    if ! git diff --cached --quiet; then
        git commit -m "chore: restore excluded files from seed merge"
        echo -e "${GREEN}✓ Committed exclusion changes${NC}\n"
    fi
fi

# Step 9: Run post-merge tests
echo -e "${BLUE}Step 9: Running tests after merge...${NC}"
if npm test -- --watchAll=false; then
    echo -e "${GREEN}✓ All tests passed${NC}\n"
else
    echo -e "${YELLOW}⚠️  Tests failed${NC}"
    echo "Fix failing tests and re-run: npm test -- --watchAll=false"
    echo "Then run: git add . && git commit -m 'fix: resolve test failures after seed merge'"
    read -p "Press enter once tests pass... "
fi

# Step 10: Show diff
echo -e "${BLUE}Step 10: Changes to be merged:${NC}"
git log --oneline $LOCAL_BRANCH..$FEATURE_BRANCH | head -10
echo ""

# Step 11: Merge to main
echo -e "${BLUE}Step 11: Merging to $LOCAL_BRANCH...${NC}"
git checkout $LOCAL_BRANCH
git merge $FEATURE_BRANCH
echo -e "${GREEN}✓ Merged to $LOCAL_BRANCH${NC}\n"

# Step 12: Push
echo -e "${BLUE}Step 12: Pushing to origin...${NC}"
if git push origin $LOCAL_BRANCH; then
    echo -e "${GREEN}✓ Pushed successfully${NC}\n"
else
    echo -e "${RED}✗ Push failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Seed project update complete!${NC}"

