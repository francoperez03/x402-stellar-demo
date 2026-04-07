# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- TypeScript ^5 - All application code (`.ts`, `.tsx`)

**Secondary:**
- CSS - Global styles and Tailwind (`app/globals.css`)

## Runtime

**Environment:**
- Node.js 23.6.1 (no `.nvmrc` or `.node-version` file pinning the version)

**Package Manager:**
- npm 10.9.4
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 15.3.8 - Full-stack React framework (App Router)
- React 19 - UI library
- React DOM 19 - DOM rendering

**Styling:**
- Tailwind CSS 4 - Utility-first CSS framework
- `@tailwindcss/postcss` ^4 - PostCSS integration for Tailwind 4
- Google Fonts (DM Serif Display) - Loaded via CSS `@import` in `app/globals.css`

**Linting:**
- ESLint ^9 - Linting via `next lint` script
- `eslint-config-next` 15.3.3 - Next.js ESLint preset
- No project-level `.eslintrc` or `eslint.config.*` file; relies on `eslint-config-next` defaults

**Build/Dev:**
- TypeScript ^5 - Type checking (strict mode enabled)
- PostCSS - CSS processing via `postcss.config.mjs`

**Testing:**
- None configured. No test framework, test runner, or test files exist.

## Key Dependencies

**Critical (x402 Protocol):**
- `@x402/core` ^2.8.0 - x402 protocol core: HTTP resource server, facilitator client, payment schemes (server + client)
- `@x402/stellar` ^2.8.0 - Stellar-specific x402 implementation: `ExactStellarScheme` for both server and client, network passphrase utilities

**Critical (Stellar Blockchain):**
- `@stellar/stellar-sdk` ^14.6.1 - Stellar SDK for blockchain interaction (contract signing types)
- `@creit.tech/stellar-wallets-kit` ^2.0.1 - Browser wallet integration (Freighter, Hana wallets)

**UI:**
- `react-confetti-explosion` ^3.0.3 - Confetti animation on successful payment reveal

## Configuration

**TypeScript (`tsconfig.json`):**
- Target: ES2017
- Module resolution: `bundler`
- Strict mode: enabled
- Path alias: `@/*` maps to project root (`"./*"`)
- JSX: `preserve` (handled by Next.js)
- Incremental compilation enabled

**Next.js (`next.config.ts`):**
- `serverExternalPackages`: `["@stellar/stellar-sdk", "@x402/stellar"]` - These packages are excluded from server-side bundling (native modules / Wasm)

**PostCSS (`postcss.config.mjs`):**
- Single plugin: `@tailwindcss/postcss`

**Environment (`.env.local`):**
- `.env.example` present with template values
- `.env.local` present (contains actual secrets - not committed)
- Required variables:
  - `SERVER_STELLAR_ADDRESS` - Stellar public key receiving payments
  - `FACILITATOR_URL` - OZ Channels facilitator endpoint (defaults to `https://channels.openzeppelin.com/x402/testnet`)
  - `FACILITATOR_API_KEY` - API key for OZ Channels

**Build Commands:**
```bash
npm run dev      # next dev - Start development server
npm run build    # next build - Production build
npm run start    # next start - Start production server
npm run lint     # next lint - Run ESLint
```

## Platform Requirements

**Development:**
- Node.js 23+ (based on current environment; no pinned version)
- A Stellar wallet browser extension (Freighter or Hana) for testing payments
- `.env.local` configured with Stellar address and OZ Channels credentials

**Production:**
- Any Node.js 18+ environment supporting Next.js 15
- Environment variables set for `SERVER_STELLAR_ADDRESS`, `FACILITATOR_URL`, `FACILITATOR_API_KEY`

**Browser Requirements:**
- Freighter or Hana wallet extension installed for Stellar signing
- Modern browser supporting Web Crypto API

---

*Stack analysis: 2026-04-07*
