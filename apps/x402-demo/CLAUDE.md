# x402-demo

## What

Pay-per-request API demo using x402 protocol on Stellar. Next.js 15 + React 19 + Tailwind 4.

## Architecture

```
app/api/content/     -> Protected API route ($0.001 USDC per request)
app/api/server-info/ -> Server balance endpoint
app/components/ui/   -> Design system primitives (Button, Card, StatusDot)
app/components/flow/ -> Protocol flow visualization (6-step diagram)
app/components/      -> Feature components (WalletBar, PaymentActions, SecretReveal, ProtocolDemo)
app/hooks/           -> React hooks (useWallet, useX402Payment, useUsdcBalance)
lib/stellar/         -> Stellar blockchain layer (network, wallet signer)
lib/x402/            -> x402 protocol layer (adapter, config, server middleware)
```

## Types

x402 protocol types (`StepData`, `Actor`, `FlowStepConfig`) are imported from `@x402/engineer` -- the canonical type source in `packages/engineer/src/types/`.

## Commands

```bash
npm run dev      # Start dev server (from repo root: npm run dev --workspace x402-demo)
npm run build    # Production build
```

## Environment

Requires `.env.local` in this directory (see `.env.example`):
- `SERVER_STELLAR_ADDRESS` -- Stellar public key that receives payments
- `FACILITATOR_URL` -- OZ Channels facilitator endpoint
- `FACILITATOR_API_KEY` -- API key from OZ Channels dashboard
