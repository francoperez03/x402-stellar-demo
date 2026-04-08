# x402 Debug Checklist

Comprehensive diagnostic checklist for `/x402:debug`. Run every check in order. Report results using `[PASS]`, `[FAIL]`, or `[WARN]` prefixes.

## Category 1: Environment Variables

### Check: SERVER_STELLAR_ADDRESS
- **How:** Read `.env.local` (or `.env`) and check for `SERVER_STELLAR_ADDRESS`
- **PASS:** Variable is set, value starts with `G`, length is 56 characters
  - Output: `[PASS] SERVER_STELLAR_ADDRESS`
- **FAIL:** Variable not set or empty
  - Output: `[FAIL] Environment variable SERVER_STELLAR_ADDRESS: Not set`
  - Fix: `Add SERVER_STELLAR_ADDRESS to .env.local (see .env.example)`
- **WARN:** Variable is set but doesn't start with `G` or length is not 56
  - Output: `[WARN] SERVER_STELLAR_ADDRESS: Value doesn't look like a Stellar public key (expected G... with 56 chars)`
  - Fix: `Verify the key at https://laboratory.stellar.org`

### Check: FACILITATOR_URL
- **How:** Read `.env.local` (or `.env`) and check for `FACILITATOR_URL`
- **PASS:** Variable is set and starts with `https://`
  - Output: `[PASS] FACILITATOR_URL`
- **FAIL:** Variable not set or empty
  - Output: `[FAIL] Environment variable FACILITATOR_URL: Not set`
  - Fix: `Add FACILITATOR_URL to .env.local. Testnet: https://channels.openzeppelin.com/x402/testnet`
- **WARN:** Variable is set but doesn't start with `https://`
  - Output: `[WARN] FACILITATOR_URL: Value doesn't look like a URL`
  - Fix: `Expected format: https://channels.openzeppelin.com/x402/testnet`

### Check: FACILITATOR_API_KEY
- **How:** Read `.env.local` (or `.env`) and check for `FACILITATOR_API_KEY`
- **PASS:** Variable is set and non-empty
  - Output: `[PASS] FACILITATOR_API_KEY`
- **FAIL:** Variable not set or empty
  - Output: `[FAIL] Environment variable FACILITATOR_API_KEY: Not set`
  - Fix: `Add FACILITATOR_API_KEY to .env.local (see .env.example). Get a key at: https://channels.openzeppelin.com/testnet/gen`

## Category 2: Dependencies

### Check: @x402/core installed
- **How:** Read `package.json` and check `dependencies` for `@x402/core`
- **PASS:** Package found in dependencies
  - Output: `[PASS] @x402/core: Installed`
- **FAIL:** Package not found
  - Output: `[FAIL] Dependency @x402/core: Not installed`
  - Fix: `Run npm install @x402/core`

### Check: @x402/stellar installed
- **How:** Read `package.json` and check `dependencies` for `@x402/stellar`
- **PASS:** Package found in dependencies
  - Output: `[PASS] @x402/stellar: Installed`
- **FAIL:** Package not found
  - Output: `[FAIL] Dependency @x402/stellar: Not installed`
  - Fix: `Run npm install @x402/stellar`

### Check: Framework-specific x402 package
- **How:** Based on detected framework, check for the correct adapter package
  - Next.js: check for `@x402/next` in dependencies
  - Express: check for `@x402/express` in dependencies
  - Fastify: skip (no official package -- uses @x402/core directly)
  - Hono: check for `@x402/hono` in dependencies
- **PASS:** Framework adapter package installed (or Fastify which doesn't need one)
  - Output: `[PASS] Framework adapter: {package} installed` or `[PASS] Framework adapter: Fastify uses @x402/core directly (no dedicated package needed)`
- **FAIL:** Framework adapter package missing
  - Output: `[FAIL] Dependency {package}: Not installed`
  - Fix: `Run npm install {package}`

### Check: Dependency versions
- **How:** Read `node_modules/@x402/core/package.json` for version
- **PASS:** Version is 2.x
  - Output: `[PASS] @x402/core version: {version}`
- **WARN:** Version is below 2.0
  - Output: `[WARN] @x402/core version {version}: Consider upgrading to 2.x`
  - Fix: `Run npm install @x402/core@latest`

## Category 3: Code Structure

### Check: Route config file exists
- **How:** Use Grep to find files containing `RoutesConfig` import
- **PASS:** At least one file found
  - Output: `[PASS] Route config: {file path}`
- **FAIL:** No file found
  - Output: `[FAIL] Route config: No routesConfig file found`
  - Fix: `Run /x402:init to create route configuration`

### Check: Server/middleware file exists
- **How:** Use Grep to find files importing from `@x402/core/server` or `@x402/express` or `@x402/hono` or `@x402/next`
- **PASS:** At least one file found
  - Output: `[PASS] Server middleware: {file path}`
- **FAIL:** No file found
  - Output: `[FAIL] Server middleware: No x402 server file found`
  - Fix: `Run /x402:init to scaffold the server middleware`

### Check: ExactStellarScheme import path
- **How:** Use Grep to find `ExactStellarScheme` imports
- **PASS:** Import path is `@x402/stellar/exact/server`
  - Output: `[PASS] ExactStellarScheme: Correctly imported from server path`
- **WARN:** Import path is `@x402/stellar/exact/client` (wrong for server-side)
  - Output: `[WARN] ExactStellarScheme: Imported from client path instead of server path`
  - Fix: `Change import to: import { ExactStellarScheme } from "@x402/stellar/exact/server"`

### Check: Protected endpoints in routesConfig
- **How:** Read routesConfig file, count entries (keys matching `"METHOD /path"` pattern)
- **PASS:** At least one route entry exists
  - Output: `[PASS] Protected endpoints: {count} route(s) configured`
- **WARN:** routesConfig is empty (no entries)
  - Output: `[WARN] No protected endpoints in routesConfig`
  - Fix: `Run /x402:add-paywall to protect an endpoint`

### Check: Price format
- **How:** Read routesConfig, check that price values start with `$`
- **PASS:** All prices start with `$`
  - Output: `[PASS] Price format: All prices use $ prefix`
- **WARN:** Price without `$` prefix found
  - Output: `[WARN] Price format: Found price without $ prefix`
  - Fix: `Use "$0.001" format (dollar sign required)`

## Category 4: Framework Detection

### Check: Framework detected
- **How:** Read `package.json` dependencies for `next`, `express`, `fastify`, `hono`
- **PASS:** Exactly one supported framework detected
  - Output: `[PASS] Framework detected: {name}`
- **WARN:** Multiple frameworks detected
  - Output: `[WARN] Multiple frameworks detected: {list}. Using {primary} based on priority.`
- **FAIL:** No supported framework detected
  - Output: `[FAIL] Framework: Could not detect framework from package.json`
  - Fix: `Supported: Next.js, Express, Fastify, Hono`

### Check: Adapter matches framework
- **How:** Cross-check detected framework with imports in server file
  - Next.js should import from `@x402/next` or use `withPayment`/`withX402`
  - Express should import from `@x402/express`
  - Fastify should import from `@x402/core/server` with custom adapter
  - Hono should import from `@x402/hono`
- **PASS:** Server file imports match detected framework
  - Output: `[PASS] Adapter matches framework: {framework}`
- **WARN:** Mismatch between framework and adapter imports
  - Output: `[WARN] Framework mismatch: Detected {framework} but server imports from {package}`
  - Fix: `Re-run /x402:init to regenerate correct adapter`

## Summary Format

After all checks, output a summary line:
- If any FAIL: `{N} passed, {N} failed, {N} warnings. Fix the FAIL items above to complete your x402 setup.`
- If no FAIL but has WARN: `{N} passed, {N} warnings. x402 is configured but review the warnings above.`
- If all PASS: `All checks passed. x402 is ready.`
