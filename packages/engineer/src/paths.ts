import path from 'node:path';
import os from 'node:os';

export interface PathsConfig {
  packageRoot: string;
  packageSkills: string;
  packageCommands: string;
  packageAgent: string;
  claudeDir: string;
  skillsDir: string;
  commandsDir: string;
  manifest: string;
}

// In compiled output (dist/cli.cjs), __dirname = packages/engineer/dist/
// Package root is one level up
const PACKAGE_ROOT = path.resolve(__dirname, '..');

export const PATHS: PathsConfig = {
  packageRoot: PACKAGE_ROOT,
  packageSkills: path.join(PACKAGE_ROOT, 'skills'),
  packageCommands: path.join(PACKAGE_ROOT, 'commands'),
  packageAgent: path.join(PACKAGE_ROOT, 'AGENT.md'),
  claudeDir: path.join(os.homedir(), '.claude'),
  skillsDir: path.join(os.homedir(), '.claude', 'skills'),
  commandsDir: path.join(os.homedir(), '.claude', 'commands'),
  manifest: path.join(os.homedir(), '.claude', 'skills', 'x402-manifest.json'),
};

/**
 * Create a PathsConfig pointing to custom directories.
 * Used by tests to redirect to temp dirs.
 */
export function getTargetPaths(homeDir: string, packageRoot: string): PathsConfig {
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
