# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**x402 Protocol (Payment Verification & Settlement):**
- OpenZeppelin Channels Facilitator - Verifies and settles x402 payments on Stellar
  - SDK/Client: `@x402/core` (`HTTPFacilitatorClient`, `x402ResourceServer`, `x402HTTPResourceServer`)
  - Server-side scheme: `ExactStellarScheme` from `@x402/stellar/exact/server`
  - Client-side scheme: `ExactStellarScheme` from `@x402/stellar/exact/client`
  - Auth: Bearer token via `FACILITATOR_API_KEY` env var
  - Endpoint: `FACILITATOR_URL` env var (default: `https://channels.openzeppelin.com/x402/testnet`)
  - Used in: `lib/x402/server.ts` (server middleware), `app/hooks/useX402Payment.ts` (client flow)

**Stellar Horizon API (Blockchain Data):**
- Stellar Horizon Testnet - Queries account balances and USDC holdings
  - Endpoint: `https://horizon-testnet.stellar.org`
  - No auth required (public API)
  - Used in: `app/api/server-info/route.ts` (server balance query), `app/hooks/useUsdcBalance.ts` (client wallet balance)
  - Queries: `GET /accounts/{address}` to read `balances` array, filtering for `asset_code === "USDC"`

**Stellar Wallet Kit (Browser Wallet Bridge):**
- Freighter Wallet - Stellar browser extension wallet
  - SDK: `@creit.tech/stellar-wallets-kit/modules/freighter` (`FreighterModule`)
  - Used in: `app/hooks/useWallet.ts`
- Hana Wallet - Stellar browser extension wallet
  - SDK: `@creit.tech/stellar-wallets-kit/modules/hana` (`HanaModule`)
  - Used in: `app/hooks/useWallet.ts`
- StellarWalletsKit orchestrates wallet discovery, auth modal, signing, and disconnect
  - Initialization: `app/hooks/useWallet.ts` via `StellarWalletsKit.init()`
  - Signing: `lib/stellar/wallet-signer.ts` via `StellarWalletsKit.signAuthEntry()`

## Data Storage

**Databases:**
- None. The application is stateless; no database is used.

**File Storage:**
- Local filesystem only. A single static asset (`public/doge-dancing.gif`) is served as the "secret" content.

**Caching:**
- None. Server-info endpoint uses `next: { revalidate: 0 }` (no caching).

## Authentication & Identity

**Auth Provider:**
- No user authentication system. Payments are anonymous.
- Wallet identity is ephemeral (address from connected wallet stored in React state only).

**Payment Auth Flow:**
1. Client connects Stellar wallet via StellarWalletsKit modal (`app/hooks/useWallet.ts`)
2. Network validated to be testnet (`app/hooks/useWallet.ts`, line 33-36)
3. Wallet signs x402 auth entries when payment is required (`lib/stellar/wallet-signer.ts`)
4. Server verifies payment via facilitator (`lib/x402/server.ts`)

## Monitoring & Observability

**Error Tracking:**
- None. Errors are caught and logged to `console.error`.

**Logs:**
- `console.error` only, in wallet connection (`app/hooks/useWallet.ts`)
- No structured logging framework

## CI/CD & Deployment

**Hosting:**
- Not configured. No deployment configuration files detected (no `Dockerfile`, `vercel.json`, `netlify.toml`, etc.)

**CI Pipeline:**
- None. No GitHub Actions, CircleCI, or other CI configuration.

## Environment Configuration

**Required env vars:**
- `SERVER_STELLAR_ADDRESS` - Stellar public key (G...) that receives USDC payments
- `FACILITATOR_API_KEY` - Bearer token for OZ Channels facilitator API

**Optional env vars (with defaults):**
- `FACILITATOR_URL` - Defaults to `https://channels.openzeppelin.com/x402/testnet`

**Env var usage locations:**
- `lib/x402/config.ts` - Reads all three env vars, exports as constants
- `app/api/server-info/route.ts` - Uses `SERVER_ADDRESS` (re-exported from config)

**Secrets location:**
- `.env.local` (gitignored). Template provided in `.env.example`.

## Webhooks & Callbacks

**Incoming:**
- None. The facilitator communicates synchronously during the request lifecycle.

**Outgoing:**
- None.

## Network Configuration

**Stellar Network:**
- Hardcoded to `stellar:testnet` in `lib/stellar/network.ts`
- Network passphrase derived via `@x402/stellar`'s `getNetworkPassphrase()` function
- All blockchain interactions target the Stellar testnet (Horizon API + payment settlement)

## Integration Architecture

**Payment Flow (6 steps):**

1. **Client -> Server**: `GET /api/content` with no payment header
2. **Server -> Client**: 402 Payment Required response with payment requirements (price, network, payTo address)
3. **Client -> Wallet**: Signs auth entry via `StellarWalletsKit.signAuthEntry()`
4. **Client -> Server**: Re-sends `GET /api/content` with `x-payment` header containing signed payment payload
5. **Server -> Facilitator**: `x402HTTPResourceServer.processHTTPRequest()` verifies payment, then `processSettlement()` settles on-chain
6. **Server -> Client**: 200 OK with protected content

**Server Middleware Pattern:**
- `withPayment()` in `lib/x402/server.ts` wraps Next.js Route Handlers
- Singleton `x402HTTPResourceServer` instance, lazily initialized
- Route config defined in `lib/x402/config.ts`: `"GET /api/content"` at `$0.001` USDC

**Client Payment Pattern:**
- `useX402Payment` hook (`app/hooks/useX402Payment.ts`) orchestrates the full 6-step flow
- Uses `x402Client` and `x402HTTPClient` from `@x402/core/client` to parse 402 responses and create payment payloads
- Payment header encoded via `httpClient.encodePaymentSignatureHeader()`

---

*Integration audit: 2026-04-07*
