# x402 Engineer Agent

## What This Is

A developer tooling package (`@x402/engineer`) that lets developers add x402-based pay-per-request monetization to any API endpoint in seconds. Ships as an npm-installable Claude Code skill pack with slash commands (`/x402:add-paywall`, `/x402:init`, `/x402:debug`, `/x402:explain`) that detect endpoints, wrap handlers with payment logic, configure the Stellar + facilitator stack, and debug the 402 → payment → retry lifecycle. Built for backend engineers, DevRel, and hackathon participants.

## Core Value

Add micropayments to any API endpoint in seconds — zero x402 protocol knowledge required.

## Requirements

### Validated

<!-- Shipped and confirmed valuable — existing in the current codebase. -->

- ✓ Working x402 payment flow demo (402 → sign → retry → settle) — existing
- ✓ `withPayment()` server middleware for Next.js App Router — existing
- ✓ `NextRequestAdapter` HTTP adapter bridging Web API to x402 — existing
- ✓ Route pricing configuration (`routesConfig`) — existing
- ✓ Stellar wallet integration via StellarWalletsKit (Freighter, Hana) — existing
- ✓ Client-side payment flow orchestration (`useX402Payment` hook) — existing
- ✓ USDC balance queries (client + server) — existing
- ✓ Protocol flow visualization (7-step sequence diagram) — existing
- ✓ Claude Code skills for x402 and Stellar development — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Monorepo structure (Turborepo) with `apps/x402-demo` and `packages/engineer`
- [ ] `@x402/engineer` npm package with CLI installer (`npx @x402/engineer install`)
- [ ] `/x402:add-paywall` — wrap any endpoint with `withPayment` across Next.js, Express, Fastify, Hono
- [ ] `/x402:init` — bootstrap x402 in a project (deps + config + env template)
- [ ] `/x402:debug` — diagnose payment flow issues (headers, facilitator, wallet, network)
- [ ] `/x402:explain` — generate contextual explanation of x402 wiring in current codebase
- [ ] Automatic endpoint detection for Next.js App Router, Express, Fastify, Hono
- [ ] Idempotent code modifications (no duplicate wrapping)
- [ ] Agent definition (AGENT.md) orchestrating skill execution
- [ ] Migrate existing `.claude/skills/` (x402-stellar, stellar-dev) into the package
- [ ] Package published on npm as `@x402/engineer`

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Multi-network support (non-Stellar) — v2, Stellar-first for now
- Privacy pools — v2+, depends on protocol maturity
- Advanced/dynamic pricing — v2, flat price sufficient for MVP
- Auto-paying agent integration — v3, requires agent economy infrastructure
- Analytics dashboard — v3, focus on developer tooling first
- GUI/web interface for the agent — CLI/slash commands only

## Context

This project started as a proof-of-concept demo showing x402 micropayments on Stellar. The existing codebase is a working Next.js app that demonstrates the full payment lifecycle. Now we're evolving it into two things:

1. **The demo stays** as a showcase app (`apps/x402-demo` in the monorepo)
2. **The npm package** (`@x402/engineer`) extracts the integration knowledge into an installable Claude Code skill pack

The existing `.claude/skills/` contain deep reference material for x402 protocol patterns and Stellar development that will form the foundation of the package's skills.

The x402 protocol lifecycle: client requests → server returns 402 with payment requirements → client signs payment → client retries with X-Payment header → server verifies via facilitator → server returns resource and settles payment.

**Target frameworks (MVP):** Next.js App Router, Express, Fastify, Hono

**Distribution:** Standard npm package. Activation via `npx @x402/engineer install` which registers skills into `~/.claude/`.

## Constraints

- **Package manager**: npm (Turborepo monorepo, npm workspaces)
- **Monorepo tool**: Turborepo
- **Package scope**: `@x402` npm org
- **Existing demo**: Must continue working after monorepo migration
- **Skill format**: Must follow Claude Code skill pack conventions (like GSD)
- **Idempotency**: All code modifications must be idempotent — running twice should not duplicate code
- **Execution speed**: Agent operations should complete in < 5 seconds
- **Context efficiency**: Skills should use minimal LLM context

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Turborepo monorepo | Fast, zero-config, great for TS monorepos | — Pending |
| npm install distribution (not git clone) | Standard developer experience, lower friction than GSD's approach | — Pending |
| CLI activation (`npx @x402/engineer install`) | Explicit opt-in, no surprise postinstall side effects | — Pending |
| All 4 slash commands in MVP | Core use cases are tightly coupled, shipping partial would feel incomplete | — Pending |
| 4 frameworks in MVP | Next.js + Express + Fastify + Hono covers vast majority of Node.js APIs | — Pending |
| Migrate existing skills into package | Existing reference material is high quality, avoids duplication | — Pending |
| npm over pnpm | User preference; npm workspaces work natively with Turborepo | — Applied |

---
*Last updated: 2026-04-07 after roadmap revision (pnpm -> npm)*
