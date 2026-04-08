---
phase: 04-distribution
plan: 03
subsystem: distribution
tags: [tsup, npm, cjs, cli, packaging, readme]

# Dependency graph
requires:
  - phase: 04-distribution plan 02
    provides: CLI install/uninstall modules and entry point (cli.ts, install.ts, uninstall.ts)
provides:
  - tsup build config producing dist/cli.cjs from src/cli.ts
  - npm-publish-ready package.json with bin, files, publishConfig, engines
  - npm README documenting install, commands, frameworks, prerequisites
affects: [npm-publish, marketplace]

# Tech tracking
tech-stack:
  added: [tsup]
  patterns: [CJS single-file CLI build, shebang preservation via tsup]

key-files:
  created:
    - packages/engineer/tsup.config.ts
    - packages/engineer/README.md
  modified:
    - packages/engineer/package.json

key-decisions:
  - "tsup CJS format with target node18 -- __dirname works natively without import.meta.url gymnastics"
  - "Single-file output (splitting: false, dts: false) -- CLI has no public TypeScript API"
  - "prepublishOnly runs build + lint as safety gate before npm publish"

patterns-established:
  - "CJS CLI output: tsup builds to dist/cli.cjs with shebang preserved automatically"
  - "npm files whitelist: dist/, skills/, commands/, AGENT.md, README.md"

requirements-completed: [DIST-01, DIST-02, DIST-03]

# Metrics
duration: 3min
completed: 2026-04-08
---

# Phase 4 Plan 3: npm Publish Readiness Summary

**tsup CJS build config, package.json hardening with publishConfig/engines/files, and concise npm README**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-08T05:57:00Z
- **Completed:** 2026-04-08T06:00:00Z
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 3

## Accomplishments
- tsup builds src/cli.ts to dist/cli.cjs as single CJS file with shebang preserved
- package.json hardened with bin, files whitelist, publishConfig (public), engines (>=18), license, keywords, prepublishOnly script
- Concise npm README covering install, 4 slash commands, supported frameworks, prerequisites, and uninstall
- End-to-end verification: build, npm pack, CLI install/uninstall, idempotency all confirmed working

## Task Commits

Each task was committed atomically:

1. **Task 1: Create tsup config and harden package.json** - `62ad4ce` (feat)
2. **Task 2: Write npm README** - `7ef33e9` (feat)
3. **Task 3: Verify CLI and npm pack end-to-end** - human-verified (checkpoint approved)

## Files Created/Modified
- `packages/engineer/tsup.config.ts` - Build config: CJS format, node18 target, single-file output
- `packages/engineer/package.json` - Added publishConfig, engines, files whitelist, keywords, prepublishOnly script
- `packages/engineer/README.md` - npm README with install/uninstall commands, slash command table, framework list

## Decisions Made
- tsup CJS format with target node18 -- __dirname works natively without import.meta.url workarounds
- Single-file output (splitting: false, dts: false) -- CLI has no public TypeScript API, no need for type declarations
- prepublishOnly runs build + lint as safety gate before npm publish

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Package is npm-publish-ready: `npm publish` from packages/engineer/ will work
- All v1 requirements complete (21/21)
- All 4 phases complete

## Self-Check: PASSED

All files and commits verified.

---
*Phase: 04-distribution*
*Completed: 2026-04-08*
