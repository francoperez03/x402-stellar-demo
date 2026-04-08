import fs from 'node:fs';

export interface Manifest {
  version: string;
  installedAt: string;
  updatedAt: string;
  paths: {
    skills: string[];
    commands: string[];
  };
}

export function readManifest(manifestPath: string): Manifest | null {
  try {
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(raw) as Manifest;
  } catch {
    return null;
  }
}

export function writeManifest(manifestPath: string, manifest: Manifest): void {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}
