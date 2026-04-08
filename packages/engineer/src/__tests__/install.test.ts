import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createTempDirs, getTestPaths } from './helpers.js';
import { readManifest } from '../manifest.js';
import { install } from '../install.js';
import type { TempDirs } from './helpers.js';
import type { PathsConfig } from '../paths.js';

describe('install', () => {
  let dirs: TempDirs;
  let paths: PathsConfig;

  beforeEach(() => {
    dirs = createTempDirs();
    paths = getTestPaths(dirs.homeDir, dirs.packageRoot);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    dirs.cleanup();
  });

  it('copies skill directories to target', () => {
    install(paths);
    expect(fs.existsSync(path.join(paths.skillsDir, 'x402-stellar', 'SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(paths.skillsDir, 'stellar-dev', 'SKILL.md'))).toBe(true);
  });

  it('copies command directory to target', () => {
    install(paths);
    expect(fs.existsSync(path.join(paths.commandsDir, 'x402', 'init.md'))).toBe(true);
  });

  it('creates ~/.claude/ directories if missing', () => {
    // Ensure no .claude directory exists
    expect(fs.existsSync(paths.claudeDir)).toBe(false);
    install(paths);
    expect(fs.existsSync(paths.skillsDir)).toBe(true);
    expect(fs.existsSync(paths.commandsDir)).toBe(true);
  });

  it('writes manifest after successful install', () => {
    install(paths);
    const manifest = readManifest(paths.manifest);
    expect(manifest).not.toBeNull();
    expect(manifest!.version).toBe('0.1.0');
  });

  it('manifest contains all installed paths', () => {
    install(paths);
    const manifest = readManifest(paths.manifest);
    expect(manifest!.paths.skills).toHaveLength(2);
    expect(manifest!.paths.commands).toHaveLength(1);
  });

  it('outputs Installed on first install', () => {
    const spy = vi.spyOn(console, 'log');
    install(paths);
    const output = spy.mock.calls.map((c) => c.join(' ')).join('\n');
    expect(output).toContain('Installed');
  });

  it('skips commands if commands directory does not exist in package', () => {
    // Remove commands dir from the package root
    fs.rmSync(paths.packageCommands, { recursive: true, force: true });
    install(paths);
    const manifest = readManifest(paths.manifest);
    expect(manifest!.paths.commands).toEqual([]);
  });
});
