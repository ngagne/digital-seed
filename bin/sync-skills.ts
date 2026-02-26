#!/usr/bin/env tsx
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.dirname(__filename);
const TMP_DIR = path.join(ROOT_DIR, '.tmp-skills');
const TARGET_DIR = path.join(ROOT_DIR, '.github', 'skills');
const REPO_URL = 'https://github.com/ngagne/digital-seed.git';

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command} ${args.join(' ')}`));
    });
  });
}

async function main(): Promise<void> {
  console.log('Starting skills sync...');

  await fs.rm(TMP_DIR, { recursive: true, force: true });
  await fs.mkdir(TMP_DIR, { recursive: true });

  await runCommand('git', ['clone', REPO_URL, TMP_DIR]);

  const repoSkillsDir = path.join(TMP_DIR, '.github', 'skills');
  let sourceDir = TMP_DIR;

  try {
    const stat = await fs.stat(repoSkillsDir);
    if (stat.isDirectory()) {
      sourceDir = repoSkillsDir;
    }
  } catch {
    // Fall back to the clone root when .github/skills is not present.
  }

  await fs.mkdir(TARGET_DIR, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const added: string[] = [];
  const replaced: string[] = [];

  for (const entry of entries) {
    const name = entry.name;
    const destinationPath = path.join(TARGET_DIR, name);

    try {
      await fs.access(destinationPath);
      replaced.push(name);
    } catch {
      added.push(name);
    }

    await fs.cp(path.join(sourceDir, name), destinationPath, {
      recursive: true,
      force: true,
    });
  }

  await fs.rm(TMP_DIR, { recursive: true, force: true });

  console.log('Skills sync completed successfully.');

  console.log('Added skills:');
  if (added.length === 0) {
    console.log('  (none)');
  } else {
    for (const name of added) {
      console.log(`  - ${name}`);
    }
  }

  console.log('Replaced skills:');
  if (replaced.length === 0) {
    console.log('  (none)');
  } else {
    for (const name of replaced) {
      console.log(`  - ${name}`);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
