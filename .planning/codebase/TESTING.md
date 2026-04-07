# Testing Patterns

**Analysis Date:** 2026-04-07

## Test Framework

**Runner:**
- No test framework is installed or configured
- No `jest`, `vitest`, `mocha`, `playwright`, or `cypress` in `package.json` dependencies
- No test configuration files exist (`jest.config.*`, `vitest.config.*`, `playwright.config.*`)

**Assertion Library:**
- Not applicable (no tests exist)

**Run Commands:**
```bash
npm run lint          # Only quality check available (ESLint via next lint)
npm run build         # Type-checking happens during build (TypeScript strict mode)
```

## Test File Organization

**Location:**
- No test files exist anywhere in the project source (`app/`, `lib/`)
- No `__tests__/` directories
- No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files

**If Adding Tests (Recommended Convention):**
- Co-locate test files with source: `lib/x402/server.test.ts` next to `lib/x402/server.ts`
- For components: `app/components/WalletBar.test.tsx` next to `app/components/WalletBar.tsx`
- For hooks: `app/hooks/useWallet.test.ts` next to `app/hooks/useWallet.ts`
- For API routes: `app/api/content/route.test.ts` next to `app/api/content/route.ts`

## Test Structure

**No existing tests to reference.** If introducing tests, follow these patterns based on the codebase structure:

**Recommended Suite Organization:**
```typescript
import { describe, it, expect } from "vitest"; // or jest

describe("withPayment", () => {
  it("returns 402 when no payment header is present", async () => {
    // arrange
    const req = new Request("http://localhost/api/content");

    // act
    const res = await withPayment(req, () => Response.json({ data: "secret" }));

    // assert
    expect(res.status).toBe(402);
  });
});
```

**Patterns to Follow:**
- Use `describe` blocks matching the function/component name
- Use `it` with descriptive behavior strings
- Arrange-Act-Assert structure within each test

## Mocking

**Framework:** Not applicable (no mocking framework installed)

**Recommended Mocking Targets Based on Codebase Architecture:**

**What to Mock:**
- `fetch` calls in hooks (`useUsdcBalance`, `useX402Payment`) and API routes (`server-info/route.ts`)
- `StellarWalletsKit` static methods in `useWallet.ts` and `wallet-signer.ts`
- `@x402/core/server` and `@x402/stellar` SDK classes in `lib/x402/server.ts`
- `process.env` values for server-side config (`lib/x402/config.ts`)

**What NOT to Mock:**
- React component rendering (test via React Testing Library)
- Internal state management within hooks (test via returned values)
- Type definitions in `app/types/x402.ts` (pure types, no runtime behavior)
- UI primitive components (`Button`, `Card`, `StatusDot`) -- test directly

**Recommended Mocking Pattern for fetch:**
```typescript
// Example: testing useUsdcBalance
const mockFetch = vi.fn();
global.fetch = mockFetch;

mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({
    balances: [{ asset_code: "USDC", balance: "100.0000" }],
  }),
});
```

**Recommended Mocking Pattern for StellarWalletsKit:**
```typescript
vi.mock("@creit.tech/stellar-wallets-kit/sdk", () => ({
  StellarWalletsKit: {
    init: vi.fn(),
    authModal: vi.fn().mockResolvedValue({ address: "GTEST..." }),
    getNetwork: vi.fn().mockResolvedValue({ networkPassphrase: "Test SDF Network ; September 2015" }),
    disconnect: vi.fn(),
    signAuthEntry: vi.fn(),
  },
}));
```

## Fixtures and Factories

**Test Data:**
- No test fixtures exist
- Key data shapes that would need fixtures:

```typescript
// StepData fixture (from app/types/x402.ts)
const mockStepData: StepData = {
  step: 1,
  label: "Request sent (no payment)",
  status: "success",
  detail: { method: "GET", url: "/api/content" },
  timestamp: Date.now(),
  elapsed: 150,
};

// Stellar account response fixture (used by useUsdcBalance and server-info route)
const mockStellarAccount = {
  balances: [
    { asset_code: "USDC", balance: "50.0000", asset_type: "credit_alphanum4" },
    { asset_type: "native", balance: "100.0000" },
  ],
};
```

**Location:**
- If adding fixtures, place in `__fixtures__/` directory at project root or co-located within test directories

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

**If Adding Coverage:**
```bash
# With vitest
npx vitest run --coverage

# With jest
npx jest --coverage
```

**Recommended Coverage Priorities (by risk):**
1. `lib/x402/server.ts` -- payment verification and settlement logic (highest risk)
2. `lib/x402/adapter.ts` -- HTTP request adaptation layer
3. `app/hooks/useX402Payment.ts` -- multi-step payment flow logic
4. `lib/stellar/wallet-signer.ts` -- signing error handling
5. `app/api/content/route.ts` -- API route integration
6. `app/api/server-info/route.ts` -- balance fetching fallback behavior

## Test Types

**Unit Tests:**
- Not implemented
- Best candidates: `lib/x402/adapter.ts` (pure class, no side effects), `lib/stellar/network.ts` (pure functions), `lib/x402/config.ts` (configuration validation)

**Integration Tests:**
- Not implemented
- Best candidates: `lib/x402/server.ts` (`withPayment` function with mocked facilitator), API route handlers

**E2E Tests:**
- Not implemented
- Would require Stellar testnet interaction and wallet browser extension
- Playwright or Cypress could test the UI flow with mocked wallet

**Component Tests:**
- Not implemented
- React Testing Library would be appropriate for components in `app/components/`
- UI primitives (`Button`, `Card`, `StatusDot`) are good candidates for visual/behavioral testing

## Existing Quality Checks

**What exists today:**
- TypeScript strict mode catches type errors at build time (`tsconfig.json` `"strict": true`)
- ESLint with Next.js rules via `npm run lint`
- `npm run build` serves as the de facto quality gate (type-checking + build verification)

**What does NOT exist:**
- Automated test runner
- Pre-commit hooks
- CI/CD pipeline with test execution
- Coverage reporting
- Snapshot testing
- Visual regression testing

## Recommended Test Setup

**Framework Choice:** Vitest (aligns with modern Next.js ecosystem, fast, ESM-native)

**Installation:**
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

**Configuration (`vitest.config.ts`):**
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
```

**Package.json scripts to add:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Common Patterns

**Async Testing (recommended for hooks and API routes):**
```typescript
it("fetches USDC balance from Horizon", async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ balances: [{ asset_code: "USDC", balance: "10.0000" }] }),
  });

  const { result } = renderHook(() => useUsdcBalance("GTEST..."));
  await waitFor(() => expect(result.current.balance).toBe("10.0000"));
});
```

**Error Testing (recommended pattern based on codebase error handling):**
```typescript
it("returns null balance when Horizon request fails", async () => {
  global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

  const { result } = renderHook(() => useUsdcBalance("GTEST..."));
  await waitFor(() => expect(result.current.balance).toBeNull());
});
```

**API Route Testing:**
```typescript
it("returns secret content when payment is verified", async () => {
  // Mock withPayment to call the handler directly
  vi.mock("@/lib/x402/server", () => ({
    withPayment: vi.fn((req, handler) => handler()),
  }));

  const { GET } = await import("@/app/api/content/route");
  const res = await GET(new Request("http://localhost/api/content"));
  const body = await res.json();

  expect(body.message).toBe("Surprise! Doge!");
  expect(body.gif).toBe("/doge-dancing.gif");
});
```

---

*Testing analysis: 2026-04-07*
