import fs from 'node:fs';
import path from 'node:path';
import { PATHS, type PathsConfig } from './paths.js';
import { readManifest } from './manifest.js';

export function uninstall(pathsOverride?: PathsConfig): void {
  const p = pathsOverride ?? PATHS;
  const manifest = readManifest(p.manifest);

  if (!manifest) {
    console.log('  x402 engineer is not installed');
    return;
  }

  // Remove skill directories listed in manifest
  for (const skillPath of manifest.paths.skills) {
    if (fs.existsSync(skillPath)) {
      fs.rmSync(skillPath, { recursive: true, force: true });
      console.log(`  \u2713 Removed ${path.basename(skillPath)} skill`);
    }
  }

  // Remove command directories listed in manifest
  for (const cmdPath of manifest.paths.commands) {
    if (fs.existsSync(cmdPath)) {
      fs.rmSync(cmdPath, { recursive: true, force: true });
      console.log(`  \u2713 Removed ${path.basename(cmdPath)} commands`);
    }
  }

  // Remove manifest itself
  fs.rmSync(p.manifest, { force: true });

  console.log('');
  console.log('  x402 engineer uninstalled');
}
