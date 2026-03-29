# x402-stellar-demo

## Project

Pay-per-request API demo using x402 protocol on Stellar. Next.js 15 + React 19 + Tailwind 4.

## Architecture

```
lib/stellar/         → Stellar blockchain layer (network, wallet signer)
lib/x402/            → x402 protocol layer (adapter, config, server middleware)
app/types/           → Shared TypeScript interfaces (StepData, FlowStepConfig)
app/hooks/           → React hooks (useWallet, useX402Payment, useUsdcBalance)
app/components/ui/   → Design system primitives (Button, Card, StatusDot)
app/components/flow/ → Protocol flow visualization (6-step diagram)
app/components/      → Feature components (WalletBar, PaymentActions, SecretReveal, ProtocolDemo)
app/api/content/     → Protected API route ($0.001 USDC per request)
```

## Skills

This project includes two skills in `.claude/skills/`:

- **x402-stellar** — x402 protocol patterns, API reference, setup guides for Stellar micropayments
- **stellar-dev** — Stellar/Soroban development: SDK usage, assets, contracts, testing, security

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Environment

Requires `.env.local` (see `.env.example` for template):
- `SERVER_STELLAR_ADDRESS` — Stellar public key that receives payments
- `FACILITATOR_URL` — OZ Channels facilitator endpoint
- `FACILITATOR_API_KEY` — API key from OZ Channels dashboard
