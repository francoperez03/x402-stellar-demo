# Architecture

**Analysis Date:** 2026-04-07

## Pattern Overview

**Overall:** Next.js App Router monolith with a clear three-layer separation: blockchain infrastructure (`lib/`), server-side payment middleware (`lib/x402/`), and client-side React UI (`app/`).

**Key Characteristics:**
- Single-page application with two API routes protected by x402 payment middleware
- Client-side x402 protocol flow orchestrated entirely by a custom hook (`useX402Payment`)
- Server-side singleton pattern for the x402 resource server (lazy init, cached across requests)
- No database -- all state is ephemeral (React state) or on-chain (Stellar testnet)
- Wallet interaction delegated to browser extensions via StellarWalletsKit

## Layers

**Blockchain Infrastructure (`lib/stellar/`):**
- Purpose: Encapsulate Stellar network configuration and wallet signing
- Location: `lib/stellar/`
- Contains: Network passphrase resolution, wallet signer factory
- Depends on: `@x402/stellar`, `@creit.tech/stellar-wallets-kit`, `@stellar/stellar-sdk`
- Used by: `lib/x402/config.ts` (server-side), `app/hooks/useX402Payment.ts` (client-side), `app/hooks/useWallet.ts` (client-side)
- Barrel export: `lib/stellar/index.ts`

**x402 Protocol Layer (`lib/x402/`):**
- Purpose: Server-side x402 payment verification, settlement, and HTTP adaptation for Next.js
- Location: `lib/x402/`
- Contains: `NextRequestAdapter` (HTTP adapter), `routesConfig` (price/route definitions), `withPayment` (middleware wrapper)
- Depends on: `@x402/core/server`, `@x402/stellar/exact/server`, `lib/stellar/` for network config
- Used by: `app/api/content/route.ts`
- Key abstraction: `withPayment()` wraps any Next.js route handler with payment verification + settlement

**API Routes (`app/api/`):**
- Purpose: Server-side HTTP endpoints exposed to clients
- Location: `app/api/`
- Contains: Two route handlers -- `/api/content` (payment-protected) and `/api/server-info` (public)
- Depends on: `lib/x402/server.ts` (payment middleware), `lib/x402/config.ts` (server address)
- Used by: Client-side hooks (`useX402Payment`, `ServerBalance` component)

**React Hooks (`app/hooks/`):**
- Purpose: Encapsulate all client-side stateful logic (wallet, payment flow, balance queries)
- Location: `app/hooks/`
- Contains: `useWallet` (wallet connect/disconnect), `useX402Payment` (full 6-step payment flow), `useUsdcBalance` (Horizon balance query)
- Depends on: `lib/stellar/` (network, signer), `@x402/core/client`, `@x402/stellar/exact/client`
- Used by: `app/components/ProtocolDemo.tsx` (sole consumer of all three hooks)
- Barrel export: `app/hooks/index.ts`

**Shared Types (`app/types/`):**
- Purpose: TypeScript interfaces shared between hooks and components
- Location: `app/types/x402.ts`
- Contains: `StepData` (payment flow step), `Actor` (sequence diagram participant), `FlowStepConfig` (visual step config)
- Depends on: Nothing
- Used by: `app/hooks/useX402Payment.ts`, all flow components, `SecretReveal.tsx`

**UI Primitives (`app/components/ui/`):**
- Purpose: Reusable design system components (no business logic)
- Location: `app/components/ui/`
- Contains: `Button.tsx` (variant-based button), `Card.tsx` (variant-based card), `StatusDot.tsx` (colored indicator)
- Depends on: Nothing (pure presentational)
- Used by: Feature components (`WalletBar`, `PaymentActions`)

**Flow Visualization (`app/components/flow/`):**
- Purpose: Render the 7-step x402 protocol sequence diagram with interactive detail panel
- Location: `app/components/flow/`
- Contains: `ProtocolFlowDiagram.tsx` (orchestrator), `ActorColumn.tsx` (header), `SequenceRow.tsx` (arrow row), `FlowDetailPanel.tsx` (detail view), `flow-config.ts` (step/actor definitions)
- Depends on: `app/types/x402.ts`
- Used by: `ProtocolDemo.tsx`
- Barrel export: `app/components/flow/index.ts`

**Feature Components (`app/components/`):**
- Purpose: Top-level feature components composing hooks + UI primitives
- Location: `app/components/`
- Contains: `ProtocolDemo.tsx` (main orchestrator), `WalletBar.tsx`, `ServerBalance.tsx`, `PaymentActions.tsx`, `SecretReveal.tsx`
- Depends on: `app/hooks/`, `app/components/ui/`, `app/components/flow/`
- Used by: `app/page.tsx`

## Data Flow

**x402 Payment Flow (primary user journey):**

1. User clicks "Reveal Secret" in `PaymentActions` -> calls `runFlow("/api/content")` via `useX402Payment`
2. Hook sends initial `GET /api/content` without payment header
3. Server middleware (`withPayment` in `lib/x402/server.ts`) intercepts, calls `server.processHTTPRequest()`, returns 402 with payment requirements in headers
4. Hook parses 402 response using `x402HTTPClient.getPaymentRequiredResponse()`
5. Hook creates payment payload via `x402HTTPClient.createPaymentPayload()` which triggers wallet signing popup (StellarWalletsKit -> Freighter/Hana browser extension)
6. Hook re-sends `GET /api/content` with `x-payment` header containing signed payment
7. Server middleware verifies payment via facilitator (`processHTTPRequest`), runs the handler (returns secret data), then settles payment via `processSettlement()`
8. Hook receives 200 response, emits step 6 to `steps` state
9. `SecretReveal` component detects step 6 success and shows modal with confetti + dancing doge GIF
10. `ProtocolDemo` detects `loading` transition false -> refetches both user USDC balance and server balance

**Step Emission Pattern:**
- `useX402Payment` maintains a `steps: StepData[]` array
- Each protocol phase calls `emit(step, label, status, detail, request?)` which appends to the array
- `ProtocolFlowDiagram` maps these steps to 7 visual rows (via `FLOW_STEPS` config, where visual steps 5-6 both map to `dataStep: 5`)
- Components react to step changes via standard React re-renders

**Wallet Connection Flow:**

1. `useWallet` initializes `StellarWalletsKit` with Freighter + Hana modules on mount
2. `connect()` opens auth modal -> returns wallet address
3. Validates wallet is on testnet via `getNetwork()` check
4. Address stored in React state, passed to `useX402Payment` and `useUsdcBalance`
5. `disconnect()` calls `StellarWalletsKit.disconnect()` and clears address

**Balance Polling:**

1. `useUsdcBalance` hook queries Stellar Horizon API directly: `GET /accounts/{address}`
2. Parses `balances` array for `asset_code === "USDC"`
3. `ServerBalance` component queries `/api/server-info` which does the same for the server address
4. Both refetch after payment flow completes (triggered by `loading` transition in `ProtocolDemo`)

**State Management:**
- No global state library -- all state lives in React hooks within `ProtocolDemo`
- `useWallet`: `address` (string | null), `kitReady` (boolean)
- `useX402Payment`: `steps` (StepData[]), `loading` (boolean)
- `useUsdcBalance`: `balance` (string | null)
- `ProtocolDemo` owns `serverRefetchKey` to trigger `ServerBalance` re-fetch
- State is lifted through props: `ProtocolDemo` passes data down to child components

## Key Abstractions

**`withPayment()` -- Server Payment Middleware:**
- Purpose: Wrap any Next.js Route Handler with x402 payment verification and settlement
- Location: `lib/x402/server.ts`
- Pattern: Higher-order function. Takes `(req, handler, parsedBody?)` and returns `Promise<Response>`
- Handles three result types: `no-payment-required`, `payment-error`, `payment-verified`
- On `payment-verified`: runs handler first, then settles payment, then merges settlement headers

**`NextRequestAdapter` -- HTTP Adapter:**
- Purpose: Bridge between Web API `Request` and x402's `HTTPAdapter` interface
- Location: `lib/x402/adapter.ts`
- Pattern: Adapter pattern. Wraps standard `Request` object to satisfy `@x402/core/server` HTTPAdapter
- Methods: `getHeader`, `getMethod`, `getPath`, `getUrl`, `getAcceptHeader`, `getUserAgent`, `getQueryParams`, `getQueryParam`, `getBody`

**`createWalletSigner()` -- Wallet Bridge:**
- Purpose: Create a `ClientStellarSigner` that delegates signing to browser wallet extensions
- Location: `lib/stellar/wallet-signer.ts`
- Pattern: Factory function. Returns object implementing `ClientStellarSigner` interface from `@x402/stellar`
- Bridges x402 signing requirements to StellarWalletsKit's `signAuthEntry` API

**`routesConfig` -- Route Pricing:**
- Purpose: Declare which routes require payment and their pricing
- Location: `lib/x402/config.ts`
- Pattern: Declarative configuration object matching `RoutesConfig` from `@x402/core/server`
- Format: `"METHOD /path"` keys mapping to `{ accepts: [{ scheme, price, network, payTo }], description, mimeType }`

**`FLOW_STEPS` -- Visual Step Configuration:**
- Purpose: Map protocol steps to visual sequence diagram rows
- Location: `app/components/flow/flow-config.ts`
- Pattern: Static configuration array. 7 visual steps map to 6 data steps (steps 5-6 share `dataStep: 5`)
- Each entry defines: `step`, `dataStep`, labels, `actor`, `from`/`to` for arrow direction

**`StepData` -- Flow Step Interface:**
- Purpose: Represent a single completed step in the payment flow
- Location: `app/types/x402.ts`
- Fields: `step` (number), `label`, `status` ("success" | "error" | "pending"), `detail` (Record), optional `request`, `timestamp`, optional `elapsed`
- Produced by: `useX402Payment` hook
- Consumed by: `ProtocolFlowDiagram`, `SecretReveal`

## Entry Points

**Page Entry (`app/page.tsx`):**
- Location: `app/page.tsx`
- Triggers: Browser navigation to `/`
- Responsibilities: Renders hero section, stats, `ProtocolDemo` component, footer. Server component (no "use client").

**Layout Entry (`app/layout.tsx`):**
- Location: `app/layout.tsx`
- Triggers: All page renders
- Responsibilities: HTML shell, metadata, global CSS import

**Protected API (`app/api/content/route.ts`):**
- Location: `app/api/content/route.ts`
- Triggers: `GET /api/content` from `useX402Payment` hook
- Responsibilities: Returns secret content (doge GIF). Protected by `withPayment` middleware requiring $0.001 USDC.

**Server Info API (`app/api/server-info/route.ts`):**
- Location: `app/api/server-info/route.ts`
- Triggers: `GET /api/server-info` from `ServerBalance` component
- Responsibilities: Returns server Stellar address and USDC balance. Public (no payment required).

## Error Handling

**Strategy:** Defensive try/catch at each boundary. Errors are surfaced to the user through the step visualization rather than thrown.

**Patterns:**
- `useX402Payment`: Wraps entire flow in try/catch; errors emit a step with `status: "error"` and `step: 0`. Individual step failures (e.g., 402 re-send returning non-200) exit early with error step.
- `withPayment()`: Returns appropriate HTTP responses for each `result.type`. `payment-error` returns the error status/headers from x402. No unhandled promise rejections.
- `createWalletSigner()`: Catches signing errors and returns structured `{ signedAuthEntry: "", error: { message, code } }` rather than throwing.
- `useWallet`: Catches init and connect failures, logs to console, sets address to null.
- `useUsdcBalance`: Catches fetch failures silently, sets balance to null.
- `ServerBalance` / `server-info` route: Catches Horizon API failures, returns `balance: null`.
- `ProtocolFlowDiagram`: Detects error steps and shows red error banner at the bottom of the diagram.

## Cross-Cutting Concerns

**Logging:** Console-only (`console.error`). Used sparingly in wallet hook for init/connect failures. No structured logging framework.

**Validation:** Minimal. Wallet network is validated against expected testnet passphrase in `useWallet`. Payment validation delegated entirely to x402 facilitator service.

**Authentication:** No user authentication. Wallet connection (Freighter/Hana) serves as identity. Payment authorization via Stellar auth entry signing.

**Configuration:** Environment variables loaded in `lib/x402/config.ts` (`SERVER_STELLAR_ADDRESS`, `FACILITATOR_URL`, `FACILITATOR_API_KEY`). Network hardcoded to `stellar:testnet` in `lib/stellar/network.ts`. Stellar SDK packages externalized via `next.config.ts` `serverExternalPackages`.

---

*Architecture analysis: 2026-04-07*
