# @x402/engineer

Claude Code skill pack for adding x402 micropayments to any API endpoint in seconds.

## Install

```bash
npx @x402/engineer install
```

This registers x402 skills and slash commands into your Claude Code environment (`~/.claude/`).

## Commands

| Command | Description |
|---------|-------------|
| `/x402:init` | Bootstrap x402 in your project (deps, env template, route config) |
| `/x402:add-paywall` | Wrap an endpoint with payment middleware (idempotent) |
| `/x402:debug` | Diagnose payment flow issues (headers, facilitator, wallet) |
| `/x402:explain` | Generate explanation of how x402 is wired in your codebase |

## Supported Frameworks

- Next.js (App Router)
- Express
- Fastify
- Hono

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and configured
- Node.js >= 18
- A Stellar wallet and OZ Channels facilitator credentials (see `/x402:init` for guided setup)

## Uninstall

```bash
npx @x402/engineer uninstall
```

## License

MIT
