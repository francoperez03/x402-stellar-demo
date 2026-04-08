# Requirements: x402 Engineer Agent

**Defined:** 2026-04-07
**Core Value:** Add micropayments to any API endpoint in seconds -- zero x402 protocol knowledge required.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Monorepo

- [x] **MONO-01**: Turborepo root with npm workspaces configured for `apps/*` and `packages/*`
- [x] **MONO-02**: Existing Next.js demo migrated to `apps/x402-demo` and fully functional
- [x] **MONO-03**: Shared TypeScript config package (`packages/tsconfig`) consumed by all workspaces

### Package

- [x] **PKG-01**: `packages/engineer` with valid `package.json` (`@x402/engineer` scope, `bin`, `files`, `publishConfig`)
- [x] **PKG-02**: Skills directory with migrated x402-stellar and stellar-dev reference content
- [x] **PKG-03**: Agent definition (AGENT.md) describing the x402 engineer agent role and capabilities

### Commands

- [ ] **CMD-01**: `/x402:init` bootstraps x402 in any supported framework (installs deps, creates env template, scaffolds route config)
- [x] **CMD-02**: `/x402:add-paywall` wraps a specified endpoint with payment middleware, idempotently
- [x] **CMD-03**: `/x402:debug` diagnoses payment flow issues across the 402 lifecycle (headers, facilitator, wallet, network)
- [x] **CMD-04**: `/x402:explain` generates contextual explanation of how x402 is wired in the current codebase

### Framework Support

- [ ] **FW-01**: Automatic framework detection from `package.json` (Next.js, Express, Fastify, Hono)
- [ ] **FW-02**: Next.js App Router adapter for `withPayment` wrapping of route handlers
- [ ] **FW-03**: Express middleware adapter for x402 payment protection
- [ ] **FW-04**: Fastify plugin adapter for x402 payment protection
- [ ] **FW-05**: Hono middleware adapter for x402 payment protection

### Distribution

- [ ] **DIST-01**: CLI entry point (`npx @x402/engineer install`) that registers skills into `~/.claude/`
- [ ] **DIST-02**: Idempotent installer (running twice does not duplicate or corrupt skills)
- [ ] **DIST-03**: Uninstall command (`npx @x402/engineer uninstall`) that cleanly removes skills

### Quality

- [x] **QUAL-01**: All code modifications are idempotent (no duplicate wrapping, imports, or config)
- [x] **QUAL-02**: Clear error messages with actionable fix suggestions for common x402 failures
- [ ] **QUAL-03**: Environment variable guidance (`.env.example` generation, validation before operations)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Distribution

- **DIST-04**: Claude Code plugin format (`.claude-plugin/plugin.json`) with native marketplace support
- **DIST-05**: Changesets for monorepo versioning and coordinated npm publishing
- **DIST-06**: Marketplace listing submission

### Protocol

- **PROT-01**: x402 V2 protocol support (sessions, wallet-based identity, dynamic recipients)
- **PROT-02**: Dynamic/tiered pricing configuration

### Advanced

- **ADV-01**: Subagent architecture (specialized agents for debug, init, etc.)
- **ADV-02**: Shell injection for live validation (facilitator ping, env checks)
- **ADV-03**: Post-edit hooks for automatic x402 config validation
- **ADV-04**: Additional framework adapters (Koa, NestJS, Deno)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| GUI/web dashboard | Claude Code is a terminal tool -- a GUI fights the paradigm |
| Multi-network support (Solana, Base) | Stellar-first strategy; each chain multiplies testing + adapter complexity |
| Auto-paying client agent | Requires agent wallet management, spending limits -- separate product |
| Analytics/revenue tracking | Requires blockchain indexing + data pipeline -- separate product |
| Automatic test generation | Payment flow testing requires testnet setup, funded accounts -- false confidence |
| MCP server | Over-engineering for MVP; skills are sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MONO-01 | Phase 1 | Complete |
| MONO-02 | Phase 1 | Complete |
| MONO-03 | Phase 1 | Complete |
| PKG-01 | Phase 2 | Complete |
| PKG-02 | Phase 2 | Complete |
| PKG-03 | Phase 2 | Complete |
| CMD-01 | Phase 3 | Pending |
| CMD-02 | Phase 3 | Complete |
| CMD-03 | Phase 3 | Complete |
| CMD-04 | Phase 3 | Complete |
| FW-01 | Phase 3 | Pending |
| FW-02 | Phase 3 | Pending |
| FW-03 | Phase 3 | Pending |
| FW-04 | Phase 3 | Pending |
| FW-05 | Phase 3 | Pending |
| DIST-01 | Phase 4 | Pending |
| DIST-02 | Phase 4 | Pending |
| DIST-03 | Phase 4 | Pending |
| QUAL-01 | Phase 3 | Complete |
| QUAL-02 | Phase 3 | Complete |
| QUAL-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after roadmap revision (pnpm -> npm)*
