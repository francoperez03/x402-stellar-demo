# Codebase Structure

**Analysis Date:** 2026-04-07

## Directory Layout

```
x402-stellar-demo/
├── app/                        # Next.js App Router (pages, components, hooks, types)
│   ├── api/                    # Server-side API route handlers
│   │   ├── content/            # Payment-protected content endpoint
│   │   │   └── route.ts
│   │   └── server-info/        # Public server info endpoint
│   │       └── route.ts
│   ├── components/             # React components
│   │   ├── flow/               # Protocol flow visualization (sequence diagram)
│   │   │   ├── ActorColumn.tsx
│   │   │   ├── FlowDetailPanel.tsx
│   │   │   ├── ProtocolFlowDiagram.tsx
│   │   │   ├── SequenceRow.tsx
│   │   │   ├── flow-config.ts
│   │   │   └── index.ts
│   │   ├── ui/                 # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── StatusDot.tsx
│   │   ├── PaymentActions.tsx  # "Reveal Secret" button
│   │   ├── ProtocolDemo.tsx    # Main demo orchestrator (composes all hooks + components)
│   │   ├── SecretReveal.tsx    # Modal overlay with confetti on success
│   │   ├── ServerBalance.tsx   # Server wallet address + USDC balance display
│   │   └── WalletBar.tsx       # Wallet connect/disconnect + client balance
│   ├── hooks/                  # Client-side React hooks
│   │   ├── index.ts
│   │   ├── useUsdcBalance.ts
│   │   ├── useWallet.ts
│   │   └── useX402Payment.ts
│   ├── types/                  # Shared TypeScript interfaces
│   │   └── x402.ts
│   ├── globals.css             # Tailwind imports + custom animations
│   ├── layout.tsx              # Root layout (HTML shell, metadata)
│   └── page.tsx                # Home page (hero, stats, ProtocolDemo, footer)
├── lib/                        # Shared non-React libraries (server + client)
│   ├── stellar/                # Stellar blockchain layer
│   │   ├── index.ts            # Barrel export
│   │   ├── network.ts          # Network config (testnet passphrase)
│   │   └── wallet-signer.ts    # Browser wallet signing bridge
│   └── x402/                   # x402 protocol server layer
│       ├── adapter.ts          # NextRequestAdapter (Web API -> x402 HTTPAdapter)
│       ├── config.ts           # Route pricing, env var loading
│       └── server.ts           # withPayment() middleware, singleton resource server
├── public/                     # Static assets
│   └── doge-dancing.gif        # The secret content revealed after payment
├── .claude/                    # Claude Code skills
│   └── skills/
│       ├── stellar-dev/        # Stellar/Soroban development reference
│       └── x402-stellar/       # x402 protocol patterns + API reference
├── .planning/                  # GSD planning documents
│   └── codebase/
├── CLAUDE.md                   # Project instructions for Claude Code
├── README.md                   # Project readme
├── next.config.ts              # Next.js config (serverExternalPackages)
├── tsconfig.json               # TypeScript config (strict, path alias @/*)
├── postcss.config.mjs          # PostCSS config (Tailwind 4)
├── package.json                # Dependencies and scripts
├── package-lock.json           # Lockfile
├── .env.example                # Environment variable template
├── .env.local                  # Local environment secrets (gitignored)
├── .gitignore                  # Git ignore rules
└── next-env.d.ts               # Next.js TypeScript declarations (generated)
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router root -- all pages, layouts, components, hooks, and types
- Contains: React components (`.tsx`), hooks, TypeScript type files, CSS, API route handlers
- Key files: `page.tsx` (home page), `layout.tsx` (root layout), `globals.css` (styles)

**`app/api/`:**
- Purpose: Server-side API endpoints using Next.js Route Handlers
- Contains: One directory per endpoint, each with a `route.ts` file
- Key files: `app/api/content/route.ts` (payment-protected), `app/api/server-info/route.ts` (public)

**`app/components/`:**
- Purpose: All React components, organized by concern
- Contains: Feature components at root level, sub-directories for `flow/` (visualization) and `ui/` (primitives)
- Key files: `ProtocolDemo.tsx` (main orchestrator that composes everything)

**`app/components/flow/`:**
- Purpose: Interactive sequence diagram visualizing the 7-step x402 protocol
- Contains: Diagram orchestrator, row/column components, detail panel, step configuration
- Key files: `flow-config.ts` (step definitions), `ProtocolFlowDiagram.tsx` (top-level diagram)

**`app/components/ui/`:**
- Purpose: Reusable design system primitives with no business logic
- Contains: Variant-based components using Tailwind classes
- Key files: `Button.tsx` (4 variants: primary, secondary, accent, ghost), `Card.tsx` (5 variants), `StatusDot.tsx`

**`app/hooks/`:**
- Purpose: Client-side stateful logic encapsulated in custom React hooks
- Contains: Wallet management, payment flow orchestration, balance queries
- Key files: `useX402Payment.ts` (core payment flow logic, ~150 lines), `useWallet.ts` (wallet connect)

**`app/types/`:**
- Purpose: Shared TypeScript interfaces used across hooks and components
- Contains: Types for the x402 payment flow visualization
- Key files: `x402.ts` (StepData, Actor, FlowStepConfig)

**`lib/stellar/`:**
- Purpose: Stellar blockchain infrastructure shared by both server and client code
- Contains: Network config, wallet signer factory
- Key files: `network.ts` (network passphrase), `wallet-signer.ts` (ClientStellarSigner factory)

**`lib/x402/`:**
- Purpose: Server-side x402 protocol integration for Next.js
- Contains: HTTP adapter, route config, payment middleware
- Key files: `server.ts` (withPayment middleware + singleton resource server), `config.ts` (env vars + route pricing), `adapter.ts` (NextRequestAdapter)

**`public/`:**
- Purpose: Static assets served at root URL
- Contains: The secret content (doge-dancing.gif)

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Home page -- renders hero, stats, ProtocolDemo, footer
- `app/layout.tsx`: Root layout -- HTML shell, metadata, global CSS
- `app/api/content/route.ts`: Payment-protected content API
- `app/api/server-info/route.ts`: Public server info API

**Configuration:**
- `next.config.ts`: Next.js config (externalizes Stellar/x402 packages for server)
- `tsconfig.json`: TypeScript strict mode, `@/*` path alias mapping to project root
- `postcss.config.mjs`: PostCSS with `@tailwindcss/postcss` plugin
- `lib/x402/config.ts`: x402 route pricing and environment variable loading
- `lib/stellar/network.ts`: Stellar network selection (hardcoded `stellar:testnet`)
- `.env.example`: Template for required environment variables

**Core Logic:**
- `lib/x402/server.ts`: `withPayment()` middleware -- the heart of server-side x402 integration
- `lib/x402/adapter.ts`: `NextRequestAdapter` -- adapts Web API Request to x402 HTTPAdapter
- `lib/stellar/wallet-signer.ts`: `createWalletSigner()` -- bridges wallet extensions to x402 signing
- `app/hooks/useX402Payment.ts`: Full 6-step client-side payment flow orchestration
- `app/hooks/useWallet.ts`: StellarWalletsKit initialization and wallet connect/disconnect
- `app/components/ProtocolDemo.tsx`: Main UI orchestrator composing all hooks and components

**Styling:**
- `app/globals.css`: Tailwind 4 import, Google Fonts (DM Serif Display), custom flow diagram animations

**Types:**
- `app/types/x402.ts`: `StepData`, `Actor`, `FlowStepConfig` interfaces

## Naming Conventions

**Files:**
- Components: PascalCase (`ProtocolDemo.tsx`, `WalletBar.tsx`, `Button.tsx`)
- Hooks: camelCase with `use` prefix (`useWallet.ts`, `useX402Payment.ts`, `useUsdcBalance.ts`)
- Config/utility: kebab-case (`flow-config.ts`, `wallet-signer.ts`, `network.ts`)
- API routes: always `route.ts` inside a directory named after the endpoint (`api/content/route.ts`)
- Barrel exports: `index.ts`
- Types: kebab-case (`x402.ts`)

**Directories:**
- Feature groups: kebab-case (`flow/`, `ui/`, `server-info/`)
- Library modules: kebab-case (`stellar/`, `x402/`)
- Next.js conventions: `app/`, `api/`, `public/`

**Exports:**
- Components: Named exports only (no default exports except `page.tsx` and `layout.tsx`)
- Hooks: Named exports
- Types: Named exports with `type` keyword
- Config objects: Named exports (`NETWORK`, `FLOW_STEPS`, `ACTOR_META`, `routesConfig`)

**Type Naming:**
- Interfaces: PascalCase, suffixed with `Props` for component props (`WalletBarProps`, `ButtonProps`)
- Type aliases: PascalCase (`Actor`, `StepData`, `FlowStepConfig`)
- Constants: UPPER_SNAKE_CASE for module-level config (`NETWORK`, `PRICE`, `ACTORS`, `FLOW_STEPS`)

## Where to Add New Code

**New Payment-Protected API Route:**
- Create directory: `app/api/{endpoint-name}/route.ts`
- Wrap handler with `withPayment()` from `@/lib/x402/server`
- Add route entry to `routesConfig` in `lib/x402/config.ts` with pricing
- Pattern: follow `app/api/content/route.ts`

**New Public API Route:**
- Create directory: `app/api/{endpoint-name}/route.ts`
- No payment wrapper needed
- Pattern: follow `app/api/server-info/route.ts`

**New React Hook:**
- Create file: `app/hooks/use{HookName}.ts`
- Add `"use client"` directive at top
- Export from barrel: add to `app/hooks/index.ts`
- Pattern: follow `app/hooks/useUsdcBalance.ts`

**New Feature Component:**
- Create file: `app/components/{ComponentName}.tsx`
- Add `"use client"` directive if it uses hooks/state/effects
- Import from `app/components/ui/` for design primitives
- Wire into `ProtocolDemo.tsx` or directly into `page.tsx`
- Pattern: follow `app/components/WalletBar.tsx`

**New UI Primitive:**
- Create file: `app/components/ui/{ComponentName}.tsx`
- Use variant pattern with `as const` maps for Tailwind classes
- Keep pure/presentational -- no business logic, no hooks
- Pattern: follow `app/components/ui/Button.tsx`

**New Flow Diagram Step:**
- Add entry to `FLOW_STEPS` array in `app/components/flow/flow-config.ts`
- Set `dataStep` to map to the corresponding `useX402Payment` emission step number
- Add new actor to `ACTORS` and `ACTOR_META` if needed
- No component changes needed -- `ProtocolFlowDiagram` renders from config dynamically

**New Shared Type:**
- Add to `app/types/x402.ts` (or create new file in `app/types/` if unrelated to x402)
- Re-export from barrel if a barrel exists for the types directory

**New Stellar Infrastructure:**
- Add file to `lib/stellar/`
- Export from `lib/stellar/index.ts` barrel
- Import via `@/lib/stellar`

**New x402 Server Logic:**
- Add to or modify files in `lib/x402/`
- If adding new scheme support, register in `getHTTPServer()` in `lib/x402/server.ts`

## Special Directories

**`.claude/skills/`:**
- Purpose: Claude Code skill definitions for Stellar and x402 development
- Generated: No (manually authored reference material)
- Committed: Yes

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: Yes (by GSD commands)
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes (by `next dev` / `next build`)
- Committed: No (gitignored)

**`public/`:**
- Purpose: Static assets served at root URL path
- Generated: No
- Committed: Yes
- Note: `doge-dancing.gif` is the "secret" content revealed after payment

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

---

*Structure analysis: 2026-04-07*
