import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createTempDirs, getTestPaths } from './helpers.js';
import { readManifest, writeManifest } from '../manifest.js';
import type { TempDirs } from './helpers.js';
import type { PathsConfig } from '../paths.js';

describe('manifest', () => {
  let dirs: TempDirs;
  let paths: PathsConfig;

  beforeEach(() => {
    dirs = createTempDirs();
    paths = getTestPaths(dirs.homeDir, dirs.packageRoot);
    // Ensure the manifest's parent directory exists
    fs.mkdirSync(path.dirname(paths.manifest), { recursive: true });
  });

  afterEach(() => {
    dirs.cleanup();
  });

  it('readManifest returns null when file does not exist', () => {
    const result = readManifest('/nonexistent/path');
    expect(result).toBeNull();
  });

  it('writeManifest creates a valid JSON file', () => {
    const manifest = {
      version: '0.1.0',
      installedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paths: { skills: [], commands: [] },
    };

    writeManifest(paths.manifest, manifest);

    const raw = fs.readFileSync(paths.manifest, 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed.version).toBe('0.1.0');
  });

  it('writeManifest and readManifest round-trip', () => {
    const manifest = {
      version: '0.1.0',
      installedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      paths: {
        skills: ['/tmp/skills/x402-stellar'],
        commands: ['/tmp/commands/x402'],
      },
    };

    writeManifest(paths.manifest, manifest);
    const result = readManifest(paths.manifest);
    expect(result).toEqual(manifest);
  });

  it('readManifest returns null for corrupted JSON', () => {
    fs.writeFileSync(paths.manifest, 'not json');
    const result = readManifest(paths.manifest);
    expect(result).toBeNull();
  });
});
