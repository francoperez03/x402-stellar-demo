# x402-stellar-demo

Pay-per-request API demo using the [x402 protocol](https://developers.stellar.org/docs/build/apps/x402) on Stellar. Built with Next.js 15, React 19, and Tailwind CSS 4.

Each API call costs **$0.001 USDC** on Stellar testnet. No API keys, no accounts — just cryptography.

## How it works

```
Browser                          Next.js API                    OZ Facilitator
  │                                  │                              │
  ├─ GET /api/content ──────────────►                               │
  │                                  │                              │
  ◄── 402 + payment requirements ────┤                              │
  │                                  │                              │
  ├─ Wallet signs auth entry ─┐      │                              │
  │  (Freighter/Hana popup)   │      │                              │
  │◄──────────────────────────┘      │                              │
  │                                  │                              │
  ├─ GET /api/content + X-Payment ──►                               │
  │                                  ├─ verify + settle ───────────►│
  │                                  │◄─ settlement confirmed ──────┤
  ◄── 200 OK { message, gif } ──────┤                              │
```

1. Client sends a request without payment → gets **HTTP 402** with payment requirements
2. Client parses the 402, creates an x402 payment payload — wallet signs a **Soroban auth entry** (USDC SAC transfer authorization)
3. Client re-sends the request with the `X-Payment` header
4. Server verifies the payment via the **OZ Facilitator**, settles on-chain, returns the response

## Project structure

```
app/
  api/
    content/route.ts           ← Paid endpoint ($0.001 USDC)
  components/
    ui/                        ← Design system primitives
      Button.tsx                   Variants: primary, secondary, accent, ghost
      Card.tsx                     Variants: default, success, error, pending
      StatusDot.tsx                Color indicators (green, red, indigo, etc.)
    flow/                      ← Protocol flow visualization
      ProtocolFlowDiagram.tsx      Horizontal 6-step flow with detail panel
      FlowNode.tsx                 Individual step node (clickable, color-coded)
      FlowConnector.tsx            Animated connector between nodes
      FlowDetailPanel.tsx          Expandable request/response detail
      flow-config.ts               Step definitions (labels, actors)
    WalletBar.tsx              ← Wallet connect/disconnect + balance
    PaymentActions.tsx         ← Payment trigger button
    SecretReveal.tsx           ← Paid content display (doge + confetti)
    ProtocolDemo.tsx           ← Orchestrator composing the above
  hooks/
    useWallet.ts               ← Wallet connection via StellarWalletsKit
    useX402Payment.ts          ← Full x402 6-step payment flow
    useUsdcBalance.ts          ← USDC balance query (Horizon API)
  types/
    x402.ts                    ← Shared TypeScript interfaces (StepData, FlowStepConfig)

lib/
  stellar/                     ← Stellar blockchain layer
    network.ts                     Network constant + passphrase helper
    wallet-signer.ts               createWalletSigner() — bridges wallet ↔ x402
    index.ts                       Barrel export
  x402/                        ← x402 protocol layer
    adapter.ts                     NextRequestAdapter (Web API Request → HTTPAdapter)
    config.ts                      Route pricing, facilitator config, env vars
    server.ts                      withPayment() wrapper for Route Handlers
```

### Layer responsibilities

| Layer | What it does | Where |
|---|---|---|
| **UI primitives** | Reusable styled components with variant props | `app/components/ui/` |
| **Feature components** | Compose UI primitives into domain-specific UI | `app/components/` |
| **Flow visualization** | Interactive 6-step protocol flow diagram | `app/components/flow/` |
| **Hooks** | React state + side effects for wallet and payments | `app/hooks/` |
| **Types** | Shared TypeScript interfaces across layers | `app/types/` |
| **Stellar** | Network config, wallet signer factory | `lib/stellar/` |
| **x402** | Protocol adapter, server middleware, route config | `lib/x402/` |
| **API routes** | Business logic protected by `withPayment()` | `app/api/` |

## Setup

### Prerequisites

- Node.js 18+
- A Stellar wallet browser extension ([Freighter](https://freighter.app/) or Hana)
- Testnet USDC in your wallet

### Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

See [`.env.example`](.env.example) for required variables.

### Getting testnet USDC

1. Fund your wallet with testnet XLM via [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
2. Add USDC trustline (issuer: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`)
3. Get testnet USDC from the [USDC faucet](https://faucet.circle.com/) (select Stellar testnet)

## Key concepts

### Wallet signer (`lib/stellar/wallet-signer.ts`)

The `createWalletSigner(address)` factory creates a `ClientStellarSigner` that delegates signing to the browser wallet extension via `StellarWalletsKit.signAuthEntry()`. This is the bridge between x402's payment system and the user's wallet — no private keys touch the app.

### Payment middleware (`lib/x402/server.ts`)

`withPayment(req, handler)` wraps any Next.js Route Handler with x402 payment verification. It:
1. Checks if the route requires payment via `routesConfig`
2. Returns 402 with payment requirements if no valid payment header
3. Verifies and settles the payment via the OZ Facilitator
4. Runs the handler and returns the response with settlement headers

### Next.js adapter (`lib/x402/adapter.ts`)

`NextRequestAdapter` bridges the Web API `Request` to x402's `HTTPAdapter` interface, replacing `@x402/express`'s `ExpressAdapter` for use in Route Handlers.

## Tech stack

- **Next.js 15** (App Router) — API routes + frontend in one project
- **React 19** — UI with hooks
- **Tailwind CSS 4** — Styling via PostCSS
- **@x402/core** + **@x402/stellar** — x402 protocol client and server
- **@creit.tech/stellar-wallets-kit** — Multi-wallet support (Freighter, Hana)
- **@stellar/stellar-sdk** — Stellar types and utilities
- **OZ Facilitator** — Payment verification and on-chain settlement
