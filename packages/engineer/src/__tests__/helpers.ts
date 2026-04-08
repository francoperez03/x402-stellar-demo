import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { PathsConfig } from '../paths.js';

export interface TempDirs {
  homeDir: string;
  packageRoot: string;
  cleanup: () => void;
}

/**
 * Create temporary directories simulating a package root and home directory.
 * Never touches real ~/.claude/ -- all operations target temp dirs.
 */
export function createTempDirs(): TempDirs {
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'x402-test-'));
  const packageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'x402-test-'));

  // Create skill directories with SKILL.md files
  const x402StellarDir = path.join(packageRoot, 'skills', 'x402-stellar');
  const stellarDevDir = path.join(packageRoot, 'skills', 'stellar-dev');
  fs.mkdirSync(x402StellarDir, { recursive: true });
  fs.mkdirSync(stellarDevDir, { recursive: true });
  fs.writeFileSync(path.join(x402StellarDir, 'SKILL.md'), '# x402 Stellar');
  fs.writeFileSync(path.join(stellarDevDir, 'SKILL.md'), '# Stellar Dev');

  // Create command files
  const commandsDir = path.join(packageRoot, 'commands', 'x402');
  fs.mkdirSync(commandsDir, { recursive: true });
  fs.writeFileSync(path.join(commandsDir, 'init.md'), '# init');
  fs.writeFileSync(path.join(commandsDir, 'add-paywall.md'), '# add-paywall');
  fs.writeFileSync(path.join(commandsDir, 'debug.md'), '# debug');
  fs.writeFileSync(path.join(commandsDir, 'explain.md'), '# explain');

  // Create package.json in the package root
  fs.writeFileSync(
    path.join(packageRoot, 'package.json'),
    JSON.stringify({ name: '@x402/engineer', version: '0.1.0' }),
  );

  const cleanup = () => {
    fs.rmSync(homeDir, { recursive: true, force: true });
    fs.rmSync(packageRoot, { recursive: true, force: true });
  };

  return { homeDir, packageRoot, cleanup };
}

/**
 * Create a PathsConfig pointing to temp directories.
 * Used by tests to redirect install/uninstall to safe temp dirs.
 */
export function getTestPaths(homeDir: string, packageRoot: string): PathsConfig {
  return {
    packageRoot,
    packageSkills: path.join(packageRoot, 'skills'),
    packageCommands: path.join(packageRoot, 'commands'),
    packageAgent: path.join(packageRoot, 'AGENT.md'),
    claudeDir: path.join(homeDir, '.claude'),
    skillsDir: path.join(homeDir, '.claude', 'skills'),
    commandsDir: path.join(homeDir, '.claude', 'commands'),
    manifest: path.join(homeDir, '.claude', 'skills', 'x402-manifest.json'),
  };
}
