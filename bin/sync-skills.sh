#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP_DIR="$ROOT_DIR/.tmp-skills"
TARGET_DIR="$ROOT_DIR/.github/skills"
REPO_URL="https://github.com/ngagne/digital-seed.git"

echo "Starting skills sync..."

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

git clone "$REPO_URL" "$TMP_DIR"

SOURCE_DIR="$TMP_DIR"
if [[ -d "$TMP_DIR/.github/skills" ]]; then
  SOURCE_DIR="$TMP_DIR/.github/skills"
fi

mkdir -p "$TARGET_DIR"

added=()
replaced=()

while IFS= read -r -d '' item; do
  name="$(basename "$item")"
  if [[ -e "$TARGET_DIR/$name" ]]; then
    replaced+=("$name")
  else
    added+=("$name")
  fi
done < <(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -print0)

cp -a "$SOURCE_DIR"/. "$TARGET_DIR"/
rm -rf "$TMP_DIR"

echo "Skills sync completed successfully."

echo "Added skills:"
if [[ ${#added[@]} -eq 0 ]]; then
  echo "  (none)"
else
  for name in "${added[@]}"; do
    echo "  - $name"
  done
fi

echo "Replaced skills:"
if [[ ${#replaced[@]} -eq 0 ]]; then
  echo "  (none)"
else
  for name in "${replaced[@]}"; do
    echo "  - $name"
  done
fi
