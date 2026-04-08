---
name: x402-explain
description: Generate a human-readable explanation of how x402 payment protection is wired in the current project.
user-invocable: true
disable-model-invocation: true
allowed-tools: [Read, Grep, Glob]
---

# /x402:explain

> I'll analyze your codebase and explain exactly how x402 payment protection is wired -- which endpoints are protected, what the payment flow looks like, and where everything is configured.

## Instructions

Output is generated fresh on every invocation -- no caching. Read the codebase live to reflect its current state.

### Step 1 -- Check for x402 setup

Use Grep to check if `@x402/core` exists in `package.json` dependencies.

If NOT found, output exactly:

"No x402 payment protection detected in this project. Run /x402:init to get started."

Then STOP. Do not proceed to further steps.

### Step 2 -- Detect framework

Check `package.json` dependencies for:
- `"next"` -- Next.js
- `"express"` -- Express
- `"fastify"` -- Fastify
- `"hono"` -- Hono

If multiple frameworks detected, prefer: Next.js > Express > Fastify > Hono (by ecosystem size).

### Step 3 -- Find configuration files

- Use Grep to find files containing `RoutesConfig` import -> this is the routesConfig file path
- Use Grep to find files containing `x402ResourceServer` or `paymentMiddleware` or `withPayment` or `withX402` -> this is the server/middleware file path
- Use Grep to find files containing `// x402: payment-protected endpoint` -> these are protected route file paths
- Read `.env.local` (or `.env` as fallback) for env var values. **Mask sensitive values:** show first 4 chars + `...` only. Never output full env var values.

### Step 4 -- Read and analyze

- Read the routesConfig file and parse route entries
- For each route entry, extract: HTTP method, path, price, network, payTo address
  - Mask payTo address: show first 4 chars + `...` + last 4 chars
- Read the server/middleware file to understand the adapter pattern being used
- Read protected route files (if any) to understand the wrapping pattern

### Step 5 -- Generate output

Produce the following markdown output. Use these exact section headings:

```markdown
## x402 Payment Protection Overview

Framework: {detected framework}
Adapter: {package name} ({version if detectable from node_modules})
Network: {network from config, e.g., "stellar:testnet"}
Receiving address: {first 4 chars}...{last 4 chars}

## Protected Endpoints

| Method | Path | Price | Asset | Network |
|--------|------|-------|-------|---------|
| GET | /api/content | $0.001 | USDC | stellar:testnet |
| ... | ... | ... | ... | ... |
```

If no endpoints in routesConfig, output instead of the table:

"No endpoints currently protected. Run /x402:add-paywall to protect an endpoint."

```markdown
## Payment Flow

1. **Client sends request** to a protected endpoint (no payment header)
2. **Server returns HTTP 402** with payment requirements in response headers
3. **Client signs a payment** using their Stellar wallet (USDC amount from routesConfig)
4. **Client retries** the same request with `X-Payment` header containing the signed payment
5. **Facilitator verifies** the payment signature and settles the transaction on Stellar
6. **Server returns the resource** after facilitator confirms payment

## Framework: {name}
```

Include framework-specific description based on detected framework:

**For Next.js:**
```
Adapter pattern: Inline handler wrapping with `withPayment()`/`withX402()`
Each route handler is individually wrapped in its `route.ts` file.
```

**For Express:**
```
Adapter pattern: Global middleware via `paymentMiddleware()` from `@x402/express`
All routes in routesConfig are automatically protected.
```

**For Fastify:**
```
Adapter pattern: Fastify plugin via custom `x402PaymentPlugin` using `@x402/core`
All routes in routesConfig are automatically protected via onRequest hook.
Note: Uses custom FastifyAdapter because @x402/fastify is not yet published on npm.
```

**For Hono:**
```
Adapter pattern: Global middleware via `paymentMiddleware()` from `@x402/hono`
All routes in routesConfig are automatically protected.
```

```markdown
## Configuration Files

| File | Purpose |
|------|---------|
| {config path} | Route pricing and environment configuration |
| {server path} | x402 middleware/adapter setup |
| .env.local | Environment variables (Stellar address, facilitator URL, API key) |
```

If Fastify is detected, add an additional row:
```
| {adapter path} | HTTPAdapter implementation (Fastify only) |
```

## Important Notes

- The Payment Flow section is always the same 6-step list (from protocol spec, not derived from codebase analysis).
- Mask all sensitive values: env vars show first 4 chars + `...`, Stellar addresses show first 4 chars + `...` + last 4 chars.
- Output sections must follow the exact headings above (`## x402 Payment Protection Overview`, `## Protected Endpoints`, `## Payment Flow`, `## Framework: {name}`, `## Configuration Files`).
- This command is read-only. Do not modify any files. Use only Read, Grep, and Glob tools.
