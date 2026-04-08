---
name: x402-debug
description: Diagnose x402 payment configuration issues. Runs static analysis checks on environment, dependencies, code structure, and framework setup.
user-invocable: true
disable-model-invocation: true
allowed-tools: [Read, Grep, Glob, Bash]
---

# /x402:debug

> Run a comprehensive diagnostic check on your x402 payment configuration. I'll check everything: env vars, dependencies, code structure, and framework setup.

## Instructions

1. **Read the full checklist** from [references/checklist.md](references/checklist.md) to get all checks with their PASS/FAIL/WARN conditions and fix instructions.

2. **Run EVERY check** in the checklist. No arguments, no scope narrowing, full checklist every time. Do not skip checks.

3. **Static analysis only:** Use Read, Grep, and Glob to inspect files. Do NOT make network calls (no curl, no fetch, no API requests). Do NOT use Write or Edit -- this command is read-only.

4. **Early exit -- no x402 setup detected:** Before running the checklist, check if `@x402/core` exists in `package.json` dependencies. If NOT found, output exactly:

   "No x402 configuration detected. Run /x402:init first."

   Then STOP. Do not run remaining checks.

5. **Environment variable handling:**
   - Read `.env.local` first. If `.env.local` doesn't exist, fall back to `.env`.
   - If neither `.env.local` nor `.env` exists, report all env var checks as FAIL with fix instruction to create `.env.local`.
   - Do NOT output env var values (security). Only report whether each variable is set/not set and whether its format is valid.

6. **Framework detection order:**
   - Detect framework FIRST (Category 4), then use detected framework for framework-specific checks in other categories.
   - Detection priority when multiple frameworks found: Next.js > Express > Fastify > Hono.

## Output Format

Group results by category with markdown headers:

### Environment Variables

Report each env var check result on its own line.

### Dependencies

Report each dependency check result on its own line.

### Code Structure

Report each code structure check result on its own line.

### Framework Detection

Report each framework check result on its own line.

**Formatting rules:**

- Each check result on its own line using `[PASS]`, `[FAIL]`, or `[WARN]` prefix
- FAIL items include `Fix:` on the next line (indented with two spaces) with the exact instruction from the checklist
- Order within each category: FAIL items first, then WARN, then PASS
- End with the summary line from the checklist (pass/fail/warning counts or "All checks passed. x402 is ready.")

## Example Output

```
### Environment Variables
[FAIL] Environment variable FACILITATOR_API_KEY: Not set
  Fix: Add FACILITATOR_API_KEY to .env.local (see .env.example). Get a key at: https://channels.openzeppelin.com/testnet/gen
[PASS] SERVER_STELLAR_ADDRESS
[PASS] FACILITATOR_URL

### Dependencies
[PASS] @x402/core: Installed
[PASS] @x402/stellar: Installed
[PASS] Framework adapter: @x402/next installed
[PASS] @x402/core version: 2.9.0

### Code Structure
[WARN] No protected endpoints in routesConfig
  Fix: Run /x402:add-paywall to protect an endpoint
[PASS] Route config: lib/x402/config.ts
[PASS] Server middleware: lib/x402/server.ts
[PASS] ExactStellarScheme: Correctly imported from server path
[PASS] Price format: All prices use $ prefix

### Framework Detection
[PASS] Framework detected: Next.js
[PASS] Adapter matches framework: Next.js

### Summary
10 passed, 1 failed, 1 warning. Fix the FAIL items above to complete your x402 setup.
```
