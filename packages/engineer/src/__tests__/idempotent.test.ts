import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createTempDirs, getTestPaths } from './helpers.js';
import { readManifest } from '../manifest.js';
import { install } from '../install.js';
import type { TempDirs } from './helpers.js';
import type { PathsConfig } from '../paths.js';

function listFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...listFilesRecursive(fullPath));
    } else {
      entries.push(fullPath);
    }
  }
  return entries.sort();
}

describe('idempotent install', () => {
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

  it('running install twice produces identical filesystem state', () => {
    install(paths);
    const snapshot1 = listFilesRecursive(paths.skillsDir);
    install(paths);
    const snapshot2 = listFilesRecursive(paths.skillsDir);
    expect(snapshot2).toEqual(snapshot1);
  });

  it('running install twice does not create duplicate files', () => {
    install(paths);
    const count1 = listFilesRecursive(paths.skillsDir).length;
    install(paths);
    const count2 = listFilesRecursive(paths.skillsDir).length;
    expect(count2).toBe(count1);
  });

  it('outputs Updated on second install', () => {
    const spy = vi.spyOn(console, 'log');

    install(paths);
    const firstOutput = spy.mock.calls.map((c) => c.join(' ')).join('\n');
    expect(firstOutput).toContain('Installed');

    spy.mockClear();

    install(paths);
    const secondOutput = spy.mock.calls.map((c) => c.join(' ')).join('\n');
    expect(secondOutput).toContain('Updated');
  });

  it('manifest updatedAt changes on re-install', async () => {
    install(paths);
    const manifest1 = readManifest(paths.manifest);

    // Small delay to ensure different timestamp
    await new Promise((r) => setTimeout(r, 10));

    install(paths);
    const manifest2 = readManifest(paths.manifest);

    expect(manifest2!.updatedAt).not.toBe(manifest1!.updatedAt);
  });

  it('manifest installedAt preserved on re-install', async () => {
    install(paths);
    const manifest1 = readManifest(paths.manifest);

    await new Promise((r) => setTimeout(r, 10));

    install(paths);
    const manifest2 = readManifest(paths.manifest);

    expect(manifest2!.installedAt).toBe(manifest1!.installedAt);
  });
});
