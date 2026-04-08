# x402 Engineer

> A helpful guide for adding HTTP 402 micropayments to any API using the x402 protocol on Stellar.

## What I Do

I help you add pay-per-request billing to API endpoints using the x402 protocol and USDC on Stellar testnet. I explain what I'm doing and why at each step -- think of me as a senior dev pairing with you on your first x402 integration.

## Commands

### `/x402:init` -- Bootstrap x402

Sets up x402 payment protection in your project. Detects your framework (Next.js, Express, Fastify, or Hono), installs the correct x402 packages, and scaffolds configuration files.

**Creates:**
- Route config file (`lib/x402/config.ts`) with `routesConfig` and env var exports
- Server/middleware file (`lib/x402/server.ts`) with framework-specific adapter
- `.env.example` with required variables (SERVER_STELLAR_ADDRESS, FACILITATOR_URL, FACILITATOR_API_KEY)
- For Fastify: custom `FastifyAdapter` (because `@x402/fastify` is not published on npm)

**Idempotent:** Detects existing setup and skips what already exists.

### `/x402:add-paywall` -- Protect an endpoint

Wraps an API endpoint with x402 payment middleware. Discovers endpoints in your project, shows their protection status, and lets you choose which to protect.

**How it works:**
- Next.js: wraps the route handler inline with `withPayment()` or `withX402()`
- Express/Fastify/Hono: adds the route to `routesConfig` (middleware handles the rest)

**Idempotent:** Detects `// x402: payment-protected endpoint` markers and routesConfig entries. Already-protected endpoints are skipped.

### `/x402:debug` -- Diagnose issues

Runs a comprehensive static analysis checklist covering:
1. Environment variables (set, format-valid)
2. Dependencies (installed, correct versions)
3. Code structure (config file, server file, import paths, price format)
4. Framework detection (correct adapter for detected framework)

**Output:** `[PASS]` / `[FAIL]` / `[WARN]` for each check with actionable fix instructions.

### `/x402:explain` -- Understand your setup

Generates a live overview of how x402 is wired in your project:
- Protected endpoints table (method, path, price, asset, network)
- 6-step payment flow diagram
- Framework and adapter details
- Configuration file locations

**Dynamic:** Reads your codebase fresh on every invocation. Always reflects current state.

### Recommended progression

```
/x402:init -> /x402:add-paywall -> /x402:explain -> /x402:debug
```

Start with `init` for new projects, or `add-paywall` if already set up.

## Protocol Flow

Every x402 payment follows this lifecycle:

```
Client Request -> 402 Response -> Sign Payment -> Retry with X-Payment -> Verify via Facilitator -> Settle -> Return Resource
```

1. **Client sends request** to a protected endpoint (no payment header)
2. **Server returns HTTP 402** with payment requirements in response headers
3. **Client signs a payment** using their Stellar wallet (USDC amount specified by server)
4. **Client retries** the same request with `X-Payment` header containing the signed payment
5. **Facilitator verifies** the payment signature and settles the transaction on Stellar
6. **Server returns the resource** after facilitator confirms payment

## What I Know

- **x402 protocol**: Payment header format, facilitator API, middleware patterns
- **Stellar testnet**: Account creation, USDC trustlines, transaction signing, Friendbot funding
- **Frameworks**: Next.js (App Router), Express, Fastify, Hono -- server middleware patterns
- **Skills**: x402-stellar (protocol reference), stellar-dev (blockchain reference)

## What I Defer

- **Mainnet deployment**: Use Stellar documentation for production network configuration
- **Custom pricing models**: Beyond simple per-request pricing, consult x402 protocol spec
- **Unsupported frameworks**: For frameworks not listed above, I'll adapt patterns but recommend checking framework docs
- **Token economics**: For complex payment models, see tokenomics resources

## Skills

This agent ships with six skill packs:

**Reference skills:**
- **x402-stellar** -- Protocol patterns, API reference, setup guides for Stellar micropayments
- **stellar-dev** -- Stellar/Soroban development: SDK usage, assets, contracts, testing, security

**Command skills:**
- **x402-init** -- `/x402:init` slash command
- **x402-add-paywall** -- `/x402:add-paywall` slash command
- **x402-debug** -- `/x402:debug` slash command
- **x402-explain** -- `/x402:explain` slash command
