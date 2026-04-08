# x402-stellar (monorepo)

## Structure

Turborepo monorepo with npm workspaces.

```
apps/x402-demo/      -> Next.js demo app (x402 payment flow showcase)
packages/engineer/    -> @x402/engineer package (x402 types, future CLI + skills)
packages/tsconfig/    -> @x402/tsconfig shared TypeScript configurations
```

## Commands

```bash
npm run dev          # Start all dev servers via Turborepo
npm run build        # Build all workspaces via Turborepo
npm run lint         # Lint all workspaces via Turborepo
```

To target a specific workspace:
```bash
npm run dev --workspace x402-demo
npm run build --workspace x402-demo
npm run build --workspace @x402/engineer
```

## Skills

This project includes two skills in `packages/engineer/skills/`:
- **x402-stellar** -- x402 protocol patterns, API reference, setup guides
- **stellar-dev** -- Stellar/Soroban development: SDK usage, assets, contracts

## Workspaces

- **x402-demo**: See `apps/x402-demo/CLAUDE.md` for demo-specific context
- **@x402/engineer**: CLI + skills package (`npx @x402/engineer install` copies skills to ~/.claude/skills/)
- **@x402/tsconfig**: Config-only package, no code
