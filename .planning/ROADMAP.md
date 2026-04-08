# Roadmap: @x402/engineer

## Overview

Transform the existing x402 payment demo into a Turborepo monorepo and build `@x402/engineer`, an npm-installable Claude Code skill pack that lets developers add x402 micropayments to any API endpoint in seconds. The roadmap moves from infrastructure (monorepo), through packaging (skill migration + agent definition), into core product (slash commands + framework adapters), and finally distribution (CLI installer + npm publish readiness).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Monorepo Foundation** - Turborepo monorepo with the existing demo migrated and fully functional (completed 2026-04-08)
- [x] **Phase 2: Package Structure** - `@x402/engineer` package skeleton with migrated skills and agent definition (completed 2026-04-08)
- [x] **Phase 3: Commands and Framework Adapters** - All four slash commands with adapters for Next.js, Express, Fastify, and Hono (completed 2026-04-08)
- [x] **Phase 4: Distribution** - CLI installer, idempotent install/uninstall, npm publish readiness (completed 2026-04-08)

## Phase Details

### Phase 1: Monorepo Foundation
**Goal**: A working Turborepo monorepo where the existing demo runs exactly as before
**Depends on**: Nothing (first phase)
**Requirements**: MONO-01, MONO-02, MONO-03
**Success Criteria** (what must be TRUE):
  1. Running `npm install` at the repo root installs all workspace dependencies without errors
  2. Running `npm run dev --workspace x402-demo` starts the demo app and the full payment flow (402 -> sign -> retry -> settle) works end-to-end
  3. A shared TypeScript config in `packages/tsconfig` is consumed by both `apps/x402-demo` and `packages/engineer`
  4. Running `npm run build` from root builds all workspaces via Turborepo task pipeline
**Plans**: TBD

Plans:
- [x] 01-01: Monorepo scaffolding (root config, tsconfig package, engineer types)
- [x] 01-02: Demo app migration (move to apps/x402-demo, update imports to @x402/engineer)
- [x] 01-03: Demo app verification (TypeScript type check, human-verified payment flow)

### Phase 2: Package Structure
**Goal**: A well-formed `@x402/engineer` package containing migrated skills and an agent definition, ready to receive command implementations
**Depends on**: Phase 1
**Requirements**: PKG-01, PKG-02, PKG-03
**Success Criteria** (what must be TRUE):
  1. `packages/engineer/package.json` has correct `@x402/engineer` scope, `bin` entry, `files` whitelist, and `publishConfig` with `access: public`
  2. Skills directory in `packages/engineer/skills/` contains the migrated x402-stellar and stellar-dev reference content as the single source of truth (old `.claude/skills/` removed or symlinked)
  3. `AGENT.md` in the package describes the x402 engineer agent role, capabilities, and how the four slash commands interact
  4. Running `npm run build --workspace engineer` produces a valid distributable package
**Plans**: TBD

Plans:
- [x] 02-01: Package infrastructure (package.json, tsup build, CLI entry point)
- [x] 02-02: Skills migration and AGENT.md

### Phase 3: Commands and Framework Adapters
**Goal**: All four slash commands work end-to-end across Next.js, Express, Fastify, and Hono with idempotent, well-error-messaged operations
**Depends on**: Phase 2
**Requirements**: CMD-01, CMD-02, CMD-03, CMD-04, FW-01, FW-02, FW-03, FW-04, FW-05, QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. `/x402:init` in a fresh Next.js/Express/Fastify/Hono project installs x402 dependencies, creates `.env.example` with required variables, and scaffolds a route config file
  2. `/x402:add-paywall` wraps a specified endpoint with the correct framework-specific payment middleware, and running it again on the same endpoint makes no changes (idempotent)
  3. `/x402:debug` inspects the current project and reports actionable diagnostics for common x402 failures (missing env vars, facilitator unreachable, malformed headers, wallet issues)
  4. `/x402:explain` generates a human-readable explanation of how x402 is wired in the current codebase, including which endpoints are protected and what the payment flow looks like
  5. Framework detection correctly identifies the project's framework from `package.json` and selects the appropriate adapter (Next.js App Router, Express middleware, Fastify plugin, Hono middleware)
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md -- /x402:init command with framework scaffolding templates
- [x] 03-02-PLAN.md -- /x402:add-paywall command with wrapping patterns
- [x] 03-03-PLAN.md -- /x402:debug and /x402:explain commands
- [x] 03-04-PLAN.md -- Wire commands into CLI and AGENT.md

### Phase 4: Distribution
**Goal**: Developers can install and uninstall the skill pack via npx with a clean, idempotent experience
**Depends on**: Phase 3
**Requirements**: DIST-01, DIST-02, DIST-03
**Success Criteria** (what must be TRUE):
  1. Running `npx @x402/engineer install` registers all skills and slash commands into `~/.claude/` and they become immediately available in Claude Code
  2. Running `npx @x402/engineer install` a second time produces no duplicates or corruption -- the installation is fully idempotent
  3. Running `npx @x402/engineer uninstall` cleanly removes all registered skills and commands with no orphaned files
**Plans**: TBD

Plans:
- [x] 04-01: Test infrastructure and foundational modules (paths.ts, manifest.ts)
- [x] 04-02: Install, uninstall, and CLI entry point
- [x] 04-03: tsup build config, package.json hardening, README

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monorepo Foundation | 3/3 | Complete | 2026-04-08 |
| 2. Package Structure | 2/2 | Complete | 2026-04-08 |
| 3. Commands and Framework Adapters | 4/4 | Complete | 2026-04-08 |
| 4. Distribution | 3/3 | Complete | 2026-04-08 |
