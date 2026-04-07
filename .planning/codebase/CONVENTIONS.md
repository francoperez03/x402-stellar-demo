# Coding Conventions

**Analysis Date:** 2026-04-07

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `WalletBar.tsx`, `ProtocolFlowDiagram.tsx`, `StatusDot.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useWallet.ts`, `useX402Payment.ts`, `useUsdcBalance.ts`)
- Configuration/utility modules: kebab-case (e.g., `flow-config.ts`, `wallet-signer.ts`, `network.ts`)
- Barrel files: `index.ts`
- API routes: `route.ts` (Next.js App Router convention)
- Type definition files: camelCase (e.g., `x402.ts`)

**Functions:**
- React components: PascalCase named function exports (`export function WalletBar(...)`)
- Hooks: camelCase with `use` prefix (`export function useWallet()`)
- Utility functions: camelCase (`export function createWalletSigner(...)`, `export function networkPassphrase()`)
- Internal/helper functions: camelCase, not exported (`function isImagePath(...)`, `function getHTTPServer()`)
- API handlers: uppercase HTTP method (`export async function GET(...)`)

**Variables:**
- Constants: UPPER_SNAKE_CASE for module-level configuration values (`NETWORK`, `PRICE`, `SERVER_ADDRESS`, `FACILITATOR_URL`, `HORIZON_TESTNET`, `ACTORS`, `ACTOR_META`, `FLOW_STEPS`)
- Local variables and state: camelCase (`walletSigner`, `selectedStep`, `lastCompletedDataStep`)
- Boolean variables: descriptive names, often with `is` prefix for derived booleans (`isActive`, `isCompleted`, `isError`, `connected`)

**Types:**
- Interfaces: PascalCase, suffixed with `Props` for component props (`WalletBarProps`, `SecretRevealProps`, `ButtonProps`)
- Type aliases: PascalCase (`Actor`, `StepData`, `FlowStepConfig`)
- Union types: string literals with pipe (`"success" | "error" | "pending"`)

## Code Style

**Formatting:**
- No Prettier config detected; relies on default ESLint/Next.js formatting
- 2-space indentation (observed in all files)
- Double quotes for JSX string attributes
- Double quotes for TypeScript string imports
- Template literals for string interpolation
- Trailing commas in function parameters and object literals
- Semicolons at end of statements

**Linting:**
- ESLint v9 with `eslint-config-next` (15.3.3)
- No custom `.eslintrc` config file; uses Next.js default rules
- Run via: `npm run lint`

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- `as const` assertions for lookup objects (variants, sizes, colors maps)
- Type-only imports used where appropriate (`import type { ... }`)
- Non-null assertions (`!`) used for required env vars (`process.env.SERVER_STELLAR_ADDRESS!`)
- Explicit return types omitted; relies on TypeScript inference for most functions

## Import Organization

**Order:**
1. `"use client"` directive (must be first line in client components)
2. React imports (`import { useState, useEffect, ... } from "react"`)
3. Third-party library imports (`@creit.tech/...`, `@x402/...`, `@stellar/...`, `react-confetti-explosion`)
4. Internal absolute imports using `@/` alias (`@/lib/stellar`, `@/lib/x402/server`)
5. Relative imports for sibling/child modules (`./WalletBar`, `../hooks`, `../../types/x402`)

**Path Aliases:**
- `@/*` maps to project root (`./` in `tsconfig.json` paths)
- Used for cross-layer imports: `@/lib/stellar`, `@/lib/x402/server`, `@/lib/x402/config`
- Relative imports used within the same feature directory (e.g., `./flow-config`, `../../types/x402`)

## Component Patterns

**Client vs. Server Components:**
- Client components marked with `"use client"` directive at file top
- All interactive components and hooks are client components
- API route handlers (`route.ts`) are server-only (no directive needed)
- `app/layout.tsx` and `app/page.tsx` are server components (no `"use client"`)

**Component Structure:**
```typescript
"use client";

import { ... } from "react";
import { ... } from "./ui/Button";

interface ComponentNameProps {
  propA: string;
  propB: () => void;
}

export function ComponentName({ propA, propB }: ComponentNameProps) {
  // hooks first
  const [state, setState] = useState(...);

  // derived values
  const derived = ...;

  // early returns for null/empty states
  if (!data) return null;

  // render
  return (
    <div>...</div>
  );
}
```

**Props Interface Convention:**
- Defined directly above the component in the same file
- Named `{ComponentName}Props`
- Callback props use `on` prefix (`onConnect`, `onDisconnect`, `onReveal`, `onSelect`)
- State props are plain descriptive names (`address`, `balance`, `steps`, `loading`)

**UI Primitives Pattern:**
- Variant/size maps defined as `as const` objects above the component
- Props interface extends native HTML attributes where appropriate (`ButtonHTMLAttributes<HTMLButtonElement>`)
- Default values via destructuring defaults
- Example from `app/components/ui/Button.tsx`:
```typescript
const variants = {
  primary: "...",
  accent: "...",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({ variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={`${variants[variant]} ${sizes[size]} ...`} {...props} />;
}
```

## Hook Patterns

**Custom Hook Structure:**
```typescript
"use client";

import { useCallback, useState } from "react";

interface UseHookNameParams {
  param1: string;
  param2: boolean;
}

export function useHookName({ param1, param2 }: UseHookNameParams) {
  const [state, setState] = useState(...);

  const action = useCallback(async () => {
    // logic
  }, [dependencies]);

  return { state, action };
}
```

**Return Pattern:**
- Hooks return plain objects (not arrays) with named properties
- `useWallet()` returns `{ kitReady, address, connect, disconnect }`
- `useX402Payment()` returns `{ steps, loading, runFlow }`
- `useUsdcBalance()` returns `{ balance, refetch }`

**Barrel Export:**
- All hooks re-exported from `app/hooks/index.ts`
- Consumed via: `import { useWallet, useX402Payment, useUsdcBalance } from "../hooks"`

## Error Handling

**Client-Side (Hooks):**
- try/catch blocks around async operations
- Errors logged to `console.error()` with descriptive message and error object
- State reset to safe defaults on error (`setAddress(null)`, `setBalance(null)`)
- Pattern:
```typescript
try {
  // async operation
} catch (error) {
  console.error("Descriptive message", error);
  setState(null);
}
```

**Client-Side (Hooks with step tracking):**
- Errors emitted as step data with `"error"` status in `useX402Payment`
- `err instanceof Error ? err.message : String(err)` pattern for error message extraction
- Loading state always cleaned up regardless of success/failure

**Server-Side (API Routes):**
- try/catch at route handler level
- Fallback to safe JSON responses on error (e.g., `{ address: "...", balance: null }`)
- Empty catch blocks used for non-critical failures (`catch { /* ignore */ }`)

**Server-Side (x402 Middleware):**
- Singleton lazy initialization with retry capability (resets `initPromise` on failure)
- Error states mapped to HTTP responses via `result.type` discriminated union
- Pattern in `lib/x402/server.ts`:
```typescript
if (result.type === "payment-error") {
  return new Response(responseBody, { status, headers });
}
```

## Logging

**Framework:** `console` (no logging library)

**Patterns:**
- `console.error()` for caught exceptions in hooks
- No `console.log()` or `console.warn()` usage detected in source code
- No structured logging or log levels

## Comments

**When to Comment:**
- JSDoc on key exported utilities that serve as API boundaries (e.g., `createWalletSigner`, `withPayment`)
- Inline comments for step-by-step flow logic (numbered steps in `useX402Payment.ts`)
- Architectural notes on singletons and lazy initialization
- Section dividers in JSX using `{/* Comment */}` for layout regions

**JSDoc Pattern:**
```typescript
/**
 * Brief description of what the function does.
 *
 * Usage:
 *   export async function GET(req: Request) {
 *     return withPayment(req, () => Response.json({ data: "..." }));
 *   }
 */
```

**No JSDoc on:**
- React components
- Hooks
- Props interfaces
- UI primitives

## Function Design

**Size:** Small, focused functions. Largest function is `runFlow` in `useX402Payment.ts` (~100 lines), which is a multi-step flow by nature. Most functions are under 30 lines.

**Parameters:**
- Single object parameter for hooks with multiple inputs (`{ address, kitReady }`)
- Destructured props for components
- Individual parameters for utility functions with few args

**Return Values:**
- Components return JSX or `null` for conditional rendering
- Hooks return plain objects with named properties
- API routes return `Response` objects (Web API standard)
- `withPayment` wraps handler functions and returns `Promise<Response>`

## Module Design

**Exports:**
- Named exports exclusively (no default exports except `page.tsx` and `layout.tsx` which Next.js requires)
- One primary export per file for components and hooks
- Multiple related exports from config/utility files

**Barrel Files:**
- `app/hooks/index.ts` re-exports all hooks
- `app/components/flow/index.ts` re-exports `ProtocolFlowDiagram` and types
- `lib/stellar/index.ts` re-exports `NETWORK`, `networkPassphrase`, `createWalletSigner`
- No barrel file for `lib/x402/` (imports reference specific files directly)

## Styling Conventions

**Approach:** Tailwind CSS v4 utility classes, inline in JSX

**Patterns:**
- All styling via `className` strings with Tailwind utilities
- No CSS modules, no styled-components
- Custom CSS only for animations in `app/globals.css`
- Color values: mix of Tailwind palette (`gray-500`, `green-400`) and custom hex (`#D4A017`, `#F5F0E8`, `#1A1A1A`)
- Responsive/layout: Tailwind grid and flex utilities
- Custom font class: `.font-headline` defined in `globals.css` using Google Fonts (DM Serif Display)
- Template literal concatenation for dynamic classes (no `clsx` or `cn` utility)

## Environment Variables

**Convention:**
- Server-only env vars: `process.env.VAR_NAME` accessed in server modules only
- Non-null assertion (`!`) for required vars: `process.env.SERVER_STELLAR_ADDRESS!`
- Fallback with `||` for optional vars with defaults: `process.env.FACILITATOR_URL || "https://..."`
- `.env.local` for local development (gitignored)
- `.env.example` for documentation of required variables

---

*Convention analysis: 2026-04-07*
