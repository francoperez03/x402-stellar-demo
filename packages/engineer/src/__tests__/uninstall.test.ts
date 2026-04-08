import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createTempDirs, getTestPaths } from './helpers.js';
import { readManifest } from '../manifest.js';
import { install } from '../install.js';
import { uninstall } from '../uninstall.js';
import type { TempDirs } from './helpers.js';
import type { PathsConfig } from '../paths.js';

describe('uninstall', () => {
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

  it('removes skill directories listed in manifest', () => {
    install(paths);
    expect(fs.existsSync(path.join(paths.skillsDir, 'x402-stellar'))).toBe(true);
    uninstall(paths);
    expect(fs.existsSync(path.join(paths.skillsDir, 'x402-stellar'))).toBe(false);
    expect(fs.existsSync(path.join(paths.skillsDir, 'stellar-dev'))).toBe(false);
  });

  it('removes command directories listed in manifest', () => {
    install(paths);
    expect(fs.existsSync(path.join(paths.commandsDir, 'x402'))).toBe(true);
    uninstall(paths);
    expect(fs.existsSync(path.join(paths.commandsDir, 'x402'))).toBe(false);
  });

  it('removes the manifest file itself', () => {
    install(paths);
    expect(fs.existsSync(paths.manifest)).toBe(true);
    uninstall(paths);
    expect(fs.existsSync(paths.manifest)).toBe(false);
  });

  it('reports not installed when no manifest exists', () => {
    const spy = vi.spyOn(console, 'log');
    uninstall(paths);
    const output = spy.mock.calls.map((c) => c.join(' ')).join('\n');
    expect(output.toLowerCase()).toContain('not installed');
  });

  it('does not touch files not in manifest', () => {
    // Create an unrelated skill
    const otherSkill = path.join(paths.skillsDir, 'my-other-skill');
    fs.mkdirSync(otherSkill, { recursive: true });
    fs.writeFileSync(path.join(otherSkill, 'SKILL.md'), '# Other Skill');

    install(paths);
    uninstall(paths);

    expect(fs.existsSync(path.join(otherSkill, 'SKILL.md'))).toBe(true);
  });

  it('handles already-deleted paths gracefully', () => {
    install(paths);
    // Manually delete one skill dir before uninstall
    fs.rmSync(path.join(paths.skillsDir, 'x402-stellar'), { recursive: true, force: true });
    // Should not throw
    expect(() => uninstall(paths)).not.toThrow();
  });
});
