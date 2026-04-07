# Codebase Concerns

**Analysis Date:** 2026-04-07

## Tech Debt

**Hardcoded Testnet Network Throughout:**
- Issue: The network is hardcoded to `"stellar:testnet"` in `lib/stellar/network.ts` and the Horizon URL `"https://horizon-testnet.stellar.org"` is duplicated as a raw string constant in two separate files. There is no environment-variable-driven network switching.
- Files: `lib/stellar/network.ts`, `app/hooks/useUsdcBalance.ts` (line 5), `app/api/server-info/route.ts` (line 3)
- Impact: Cannot switch to mainnet without code changes in multiple files. The duplicated Horizon URL must be updated in two places, creating a consistency risk.
- Fix approach: Move `HORIZON_URL` to a shared constant in `lib/stellar/network.ts` derived from the `NETWORK` constant. Add an env var (e.g., `STELLAR_NETWORK`) to control testnet/mainnet selection.

**Non-Null Assertions on Environment Variables:**
- Issue: `process.env.SERVER_STELLAR_ADDRESS!` and `process.env.FACILITATOR_API_KEY!` use TypeScript non-null assertions (`!`) without runtime validation. If these env vars are missing, the app silently uses `undefined`, which will cause cryptic failures at request time rather than a clear startup error.
- Files: `lib/x402/config.ts` (lines 4, 8)
- Impact: Difficult-to-debug runtime errors when environment is misconfigured. The server starts successfully but fails on first payment request.
- Fix approach: Add a startup validation function that throws descriptive errors if required env vars are missing. Call it from `lib/x402/config.ts` or a top-level server initialization module.

**Hardcoded Price in UI:**
- Issue: The price `$0.001` is defined as a constant in `lib/x402/config.ts` (`PRICE`), but the UI in `app/page.tsx` (lines 16-17) and `app/components/PaymentActions.tsx` (line 13) hardcodes `"$0.001"` as literal strings rather than referencing the config constant.
- Files: `app/page.tsx`, `app/components/PaymentActions.tsx`, `lib/x402/config.ts`
- Impact: Changing the price in config will not update the UI. Users see a stale price.
- Fix approach: Import `PRICE` from config into client components, or expose the price via the `/api/server-info` endpoint and display it dynamically.

**Unused UI Component:**
- Issue: `app/components/ui/Card.tsx` is defined but never imported or used by any other file in the codebase.
- Files: `app/components/ui/Card.tsx`
- Impact: Dead code. Minor, but increases maintenance surface.
- Fix approach: Remove the file, or use it where appropriate (e.g., `ServerBalance`, `FlowDetailPanel`).

**No ESLint Configuration File:**
- Issue: `eslint` and `eslint-config-next` are listed in `devDependencies` and `npm run lint` is defined, but there is no `.eslintrc.*` or `eslint.config.*` file in the project root. Next.js will use its default ESLint config, but there are no project-specific rules enforced.
- Files: `package.json`
- Impact: No consistent code quality enforcement beyond Next.js defaults. No Prettier or formatting tool configured.
- Fix approach: Add an `eslint.config.mjs` with project-specific rules. Consider adding Prettier for formatting consistency.

## Known Bugs

**`kitReady` Hardcoded to `true` in ProtocolDemo:**
- Symptoms: The `useX402Payment` hook receives `kitReady: true` always, bypassing the actual initialization state from `useWallet`. If `StellarWalletsKit.init()` fails (line 16-23 in `useWallet.ts`), the wallet signer may be created before the kit is ready, leading to signing failures.
- Files: `app/components/ProtocolDemo.tsx` (line 16), `app/hooks/useWallet.ts`
- Trigger: `useWallet()` returns `kitReady` but `ProtocolDemo` ignores it and passes `kitReady: true` directly.
- Workaround: The `useWallet` hook currently initializes synchronously in a `useEffect`, so in practice the kit is usually ready by the time the user clicks. But if init fails, the button remains enabled with no feedback.
- Fix: Pass `kitReady` from the `useWallet()` return value to `useX402Payment()`.

**Silent Error Swallowing in Multiple Hooks:**
- Symptoms: Several `catch` blocks silently discard errors with no user-facing feedback: `useUsdcBalance.ts` (line 29), `ServerBalance.tsx` (line 23), `useWallet.ts` disconnect (line 49).
- Files: `app/hooks/useUsdcBalance.ts`, `app/components/ServerBalance.tsx`, `app/hooks/useWallet.ts`
- Trigger: Network errors, Horizon API downtime, or wallet extension issues.
- Workaround: None. The user sees stale or null data with no indication that a fetch failed.
- Fix: Add error states to hooks and surface them in the UI (e.g., "Failed to fetch balance").

## Security Considerations

**No Rate Limiting on API Routes:**
- Risk: The `/api/content` and `/api/server-info` endpoints have no rate limiting. While `/api/content` is payment-gated via x402, a malicious actor could flood the server with unpaid requests, each of which triggers facilitator communication and 402 response generation.
- Files: `app/api/content/route.ts`, `app/api/server-info/route.ts`
- Current mitigation: None.
- Recommendations: Add rate limiting middleware (e.g., using Next.js middleware with an in-memory or Redis-backed counter). At minimum, rate-limit `/api/server-info` which is completely unauthenticated.

**No CORS Configuration:**
- Risk: API routes are accessible from any origin by default. While this is typical for a demo, any production deployment should restrict origins.
- Files: `app/api/content/route.ts`, `app/api/server-info/route.ts`
- Current mitigation: None.
- Recommendations: Add CORS headers in a Next.js middleware file or per-route. Restrict to the app's own origin in production.

**Server Address Exposed via API:**
- Risk: `/api/server-info` exposes the full Stellar server address and USDC balance to any caller. While Stellar addresses are public by nature, explicitly broadcasting them with balance info could invite targeted attacks.
- Files: `app/api/server-info/route.ts`
- Current mitigation: None.
- Recommendations: Acceptable for a testnet demo. For mainnet, consider whether this endpoint is necessary or if the address should be partially masked.

**No Content Security Policy:**
- Risk: No CSP headers configured. The app loads a Google Fonts stylesheet from an external CDN (`globals.css` line 1), and there are no protections against XSS via injected scripts.
- Files: `app/globals.css`, `app/layout.tsx`
- Current mitigation: None.
- Recommendations: Add CSP headers via Next.js `next.config.ts` or middleware. At minimum, whitelist `fonts.googleapis.com` and `fonts.gstatic.com`.

**Facilitator API Key in Server-Side Code:**
- Risk: The facilitator API key is accessed via `process.env.FACILITATOR_API_KEY!` and used in an `Authorization: Bearer` header. This is correct (server-side only), but there is no validation that this value is not accidentally exposed to the client bundle.
- Files: `lib/x402/config.ts`, `lib/x402/server.ts`
- Current mitigation: The file is only imported by server-side route handlers. Next.js strips server-only code from client bundles by default.
- Recommendations: Consider adding the `server-only` package import to `lib/x402/server.ts` and `lib/x402/config.ts` to get a build-time error if these modules are accidentally imported from a client component.

## Performance Bottlenecks

**Lazy Singleton Initialization on First Request:**
- Problem: The x402 server (facilitator client, resource server, HTTP server) is initialized lazily on the first payment request via `ensureInitialized()`. The first user to hit `/api/content` experiences a cold-start delay.
- Files: `lib/x402/server.ts` (lines 16-48)
- Cause: The `initialize()` call is deferred until the first request.
- Improvement path: Pre-initialize the server during module load or in a Next.js instrumentation hook. The current pattern is acceptable for a demo but adds latency to the first request.

**No Caching on Horizon Balance Fetches:**
- Problem: Both `useUsdcBalance` and `ServerBalance` fetch account data from Horizon on every render cycle / refetch. The server-info route uses `next: { revalidate: 0 }`, explicitly disabling caching.
- Files: `app/hooks/useUsdcBalance.ts`, `app/api/server-info/route.ts` (line 8)
- Cause: Real-time balance display requires fresh data, but the client hook has no debounce or polling interval.
- Improvement path: Add a polling interval (e.g., every 10-30 seconds) instead of fetching on every component mount. For `server-info`, consider a short revalidation window (e.g., 10 seconds).

**Google Fonts Loaded via External CSS Import:**
- Problem: `globals.css` imports Google Fonts via `@import url(...)`, which is a render-blocking request to an external CDN.
- Files: `app/globals.css` (line 1)
- Cause: External CSS import blocks rendering until the font stylesheet is fetched.
- Improvement path: Use `next/font` to self-host the DM Serif Display font. This eliminates the external request, improves loading performance, and removes the Google Fonts privacy/CSP concern.

## Fragile Areas

**Payment Flow State Machine (useX402Payment):**
- Files: `app/hooks/useX402Payment.ts`
- Why fragile: The payment flow is implemented as a sequential imperative function with numbered step emissions (1-6). Adding, removing, or reordering steps requires updating the step numbers in the hook, the `FLOW_STEPS` config in `app/components/flow/flow-config.ts`, and the `SecretReveal` component which checks for `step === 6`. There is no formal state machine; the step numbering is the implicit contract.
- Safe modification: When changing the flow, update all three locations: the hook's `emit()` calls, the `FLOW_STEPS` array, and any component that checks specific step numbers (like `SecretReveal` checking `s.step === 6`).
- Test coverage: None. No automated tests exist.

**Wallet Signer Bridge:**
- Files: `lib/stellar/wallet-signer.ts`
- Why fragile: This is the bridge between the x402 SDK and browser wallet extensions. It depends on the `StellarWalletsKit` static API and the `ClientStellarSigner` interface from `@x402/stellar`. Any breaking change in either package's API will break signing. The error handling returns an object with `signedAuthEntry: ""` on failure, which may or may not be handled correctly by the x402 client.
- Safe modification: Test wallet signing manually in the browser after any dependency update. Ensure the error shape matches what `@x402/stellar` expects.
- Test coverage: None.

**`NextRequestAdapter` Coupling to x402 SDK:**
- Files: `lib/x402/adapter.ts`
- Why fragile: This adapter implements the `HTTPAdapter` interface from `@x402/core/server`. If the interface changes (new required methods), the adapter will silently break at runtime since TypeScript only catches this at compile time if the interface is properly typed. The adapter is currently not verified against a specific SDK version contract.
- Safe modification: After upgrading `@x402/core`, verify the `HTTPAdapter` interface has not changed by running `npm run build`.
- Test coverage: None.

## Scaling Limits

**Single Protected Route:**
- Current capacity: One payment-protected endpoint (`GET /api/content`).
- Limit: The `routesConfig` in `lib/x402/config.ts` must be manually extended for each new protected route. The `withPayment()` wrapper in `lib/x402/server.ts` must be called explicitly in each route handler.
- Scaling path: Create a Next.js middleware that applies x402 protection based on route patterns, eliminating the need to wrap each handler individually.

**In-Memory Singleton:**
- Current capacity: Works for a single server instance.
- Limit: The `httpServer` singleton in `lib/x402/server.ts` is in-process memory. In a serverless environment (Vercel), each cold start re-initializes. In a multi-instance deployment, there is no shared state (which is fine since the facilitator is the source of truth).
- Scaling path: Accept cold-start cost in serverless, or move to a persistent edge worker.

## Dependencies at Risk

**`@x402/core` and `@x402/stellar` (v2.8.0):**
- Risk: These are the core protocol libraries. The x402 protocol is relatively new and the SDK API may change significantly between minor versions. The project imports from deep subpaths (`@x402/core/server`, `@x402/core/client`, `@x402/stellar/exact/server`, `@x402/stellar/exact/client`) which are more likely to be reorganized.
- Impact: Breaking changes would affect `lib/x402/server.ts`, `lib/x402/adapter.ts`, `lib/x402/config.ts`, and `app/hooks/useX402Payment.ts`.
- Migration plan: Pin exact versions in `package.json`. Monitor the x402 changelog. The `lib/x402/` layer isolates most SDK coupling from the rest of the app.

**`@creit.tech/stellar-wallets-kit` (v2.0.1):**
- Risk: Wallet kit depends on browser wallet extensions (Freighter, Hana). If either extension updates its API or is discontinued, the wallet module import will fail or behave unexpectedly. The kit uses static methods on `StellarWalletsKit` class, which is an unusual pattern that could change.
- Impact: Wallet connection and signing would break.
- Migration plan: The wallet interaction is isolated in `app/hooks/useWallet.ts` and `lib/stellar/wallet-signer.ts`. Replacing the kit would require changes only in these two files.

## Missing Critical Features

**No Error Boundary:**
- Problem: There is no React Error Boundary anywhere in the component tree. If a component throws during rendering (e.g., wallet kit initialization fails, JSON parsing error in flow detail), the entire app crashes with a white screen.
- Blocks: Production readiness. Users would see a blank page with no recovery path.

**No Loading/Error States for Server Info:**
- Problem: `ServerBalance` returns `null` while loading and also returns `null` on error. There is no loading spinner or error message. Users cannot distinguish between "still loading" and "failed to load."
- Blocks: Usability when Horizon API is slow or down.

**No Wallet Reconnection Persistence:**
- Problem: The wallet connection state is entirely in React state (`useState`). Refreshing the page disconnects the wallet. There is no persistence (localStorage, cookie) to remember the connected wallet.
- Blocks: Smooth user experience across page reloads.

## Test Coverage Gaps

**Zero Test Files:**
- What's not tested: The entire codebase. There are no test files (`.test.ts`, `.test.tsx`, `.spec.ts`) outside of `node_modules/`. No test framework (Jest, Vitest) is configured.
- Files: Every file in `lib/` and `app/`
- Risk: Any change to the x402 payment flow, wallet signing, adapter, or UI components could introduce regressions with no automated detection.
- Priority: High. The most critical areas to test first:
  1. `lib/x402/adapter.ts` - Unit test the `NextRequestAdapter` methods
  2. `lib/x402/server.ts` - Unit test `withPayment()` with mocked SDK
  3. `app/hooks/useX402Payment.ts` - Test the flow step emission logic
  4. `lib/stellar/wallet-signer.ts` - Test error handling paths

---

*Concerns audit: 2026-04-07*
