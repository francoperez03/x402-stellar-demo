import fs from 'node:fs';
import path from 'node:path';
import { PATHS, type PathsConfig } from './paths.js';
import { readManifest, writeManifest } from './manifest.js';

export function install(pathsOverride?: PathsConfig): void {
  const p = pathsOverride ?? PATHS;
  const existing = readManifest(p.manifest);
  const isUpdate = existing !== null;

  const version = JSON.parse(
    fs.readFileSync(path.join(p.packageRoot, 'package.json'), 'utf-8'),
  ).version;

  // Ensure target directories exist
  fs.mkdirSync(p.skillsDir, { recursive: true });
  fs.mkdirSync(p.commandsDir, { recursive: true });

  const installedSkills: string[] = [];
  const installedCommands: string[] = [];

  // Copy skills
  const skillDirs = fs
    .readdirSync(p.packageSkills, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const dir of skillDirs) {
    const src = path.join(p.packageSkills, dir.name);
    const dest = path.join(p.skillsDir, dir.name);
    fs.cpSync(src, dest, { recursive: true, force: true });
    installedSkills.push(dest);
    const verb = isUpdate ? 'Updated' : 'Installed';
    console.log(`  \u2713 ${verb} ${dir.name} skill`);
  }

  // Copy commands (guard: only if x402 command dir exists in package)
  if (fs.existsSync(path.join(p.packageCommands, 'x402'))) {
    const src = path.join(p.packageCommands, 'x402');
    const dest = path.join(p.commandsDir, 'x402');
    fs.cpSync(src, dest, { recursive: true, force: true });
    installedCommands.push(dest);
    const verb = isUpdate ? 'Updated' : 'Installed';
    console.log(`  \u2713 ${verb} x402 commands`);
  }

  // Write manifest LAST after all copies succeed
  writeManifest(p.manifest, {
    version,
    installedAt: existing?.installedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paths: { skills: installedSkills, commands: installedCommands },
  });

  console.log('');
  console.log('  Run /x402:init to get started');
}
