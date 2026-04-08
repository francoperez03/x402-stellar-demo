---
name: x402-init
description: Bootstrap x402 payment protection in a project. Detects framework, installs dependencies, creates config files, and scaffolds adapter.
user-invocable: true
disable-model-invocation: true
argument-hint: "[framework]"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# /x402:init

> Bootstrap x402 payment protection in your project. I'll detect your framework, install the right packages, and scaffold all config files.

## Important Rules

- Do NOT install `@x402/fastify` -- it does not exist on npm. For Fastify, use `@x402/core` directly with a custom adapter.
- Server-side `ExactStellarScheme` import path is always `@x402/stellar/exact/server` (NOT `@x402/stellar/exact/client`).
- All templates are in this skill's `templates/` directory. Read the template file and use its content as the basis for generated code.
- Adapt import paths if needed based on project structure (e.g., relative paths based on file placement).

## Step 1 -- Check for Existing x402 Setup (Idempotency)

Before creating anything, check if x402 is already configured:

1. **Check dependencies:** Use Grep to search for `@x402/core` in `package.json` dependencies
2. **Check route config:** Use Glob to find files, then Grep to search for files containing a `RoutesConfig` import from `@x402/core/server`
3. **Check env template:** Use Read to check if `.env.example` already contains `SERVER_STELLAR_ADDRESS`

**If all 3 exist:**
Output: `"x402 is already set up. {N} files exist, {N} skipped. Run /x402:debug to verify configuration."`
STOP -- do not create or modify any files.

**If some exist:**
Report which pieces are already present. Skip those. Only create the missing pieces. Continue to the relevant steps below, skipping steps for components that already exist.

## Step 2 -- Detect Framework

**If `$ARGUMENTS` is provided** (e.g., `/x402:init express`), use that framework directly. Skip detection.

**Otherwise, detect from `package.json`:**

1. Read `package.json` in the current working directory
2. If no `package.json` in the current directory, walk up parent directories to find the nearest one
3. Check the `dependencies` object (not `devDependencies`) for framework packages
4. Detection heuristics -- priority: Next.js > Express > Fastify > Hono (if multiple found, use the first match):
   - `"next"` in dependencies -> **Next.js App Router**
   - `"express"` in dependencies -> **Express**
   - `"fastify"` in dependencies -> **Fastify**
   - `"hono"` in dependencies -> **Hono**

**Edge cases:**
- If `@nestjs/core` is found in dependencies, warn: `"NestJS detected, using underlying Express/Fastify adapter"` and detect which underlying framework NestJS uses (check for `@nestjs/platform-express` or `@nestjs/platform-fastify`)
- If no supported framework is detected, output: `"Could not detect framework from package.json. Supported: Next.js, Express, Fastify, Hono."` and STOP

## Step 3 -- Detect Project Structure

Determine where to place x402 files based on existing project conventions:

1. Check if the project uses a `src/` directory pattern (e.g., `src/lib/`, `src/app/`, or other code under `src/`)
2. If `src/` exists and contains code files: place x402 files in `src/lib/x402/`
3. If no `src/` directory: place x402 files in `lib/x402/`
4. For Next.js specifically: check for `app/` directory to confirm App Router usage

Store the base directory (`src/lib` or `lib`) for use in subsequent steps.

## Step 4 -- Install Dependencies

Output: `"Installing @x402/core and @x402/stellar..."`

Run the framework-specific install command via Bash:

| Framework | Install Command |
|-----------|----------------|
| Next.js   | `npm install @x402/next @x402/core @x402/stellar` |
| Express   | `npm install @x402/express @x402/core @x402/stellar` |
| Fastify   | `npm install @x402/core @x402/stellar` |
| Hono      | `npm install @x402/hono @x402/core @x402/stellar` |

**Fastify note:** Do NOT install `@x402/fastify` -- it does not exist on npm. Only `@x402/core` and `@x402/stellar` are needed. The custom adapter code is scaffolded in Step 6.

## Step 5 -- Scaffold Config Files

1. Read the appropriate config template: `templates/{framework}/config.ts.md`
   - Where `{framework}` is `next-app-router`, `express`, `fastify`, or `hono`
2. Extract the TypeScript code from the template's fenced code block
3. Write to `{base_dir}/x402/config.ts` (where `base_dir` was determined in Step 3)

4. Read `templates/env-example.md`
5. Extract the env content from the template's fenced code block
6. Check if `.env.example` already exists at the project root:
   - If it does NOT exist: create `.env.example` with the template content
   - If it DOES exist: check if it already contains `SERVER_STELLAR_ADDRESS`. If not, append the x402 section to the existing file
7. Output: `"Created .env.example with required variables. Copy to .env.local and fill in your values."`

## Step 6 -- Scaffold Server/Middleware Files

1. Read the appropriate server template: `templates/{framework}/server.ts.md`
2. Extract the TypeScript code from the template's fenced code block
3. Write to `{base_dir}/x402/server.ts`

**For Fastify only -- also scaffold the adapter:**
4. Read `templates/fastify/adapter.ts.md`
5. Extract the TypeScript code from the template's fenced code block
6. Write to `{base_dir}/x402/adapter.ts`

## Step 7 -- Summary

Count the files created during this run and output:

`"x402 initialized. Created {N} files: {file list}"`

List each file with its relative path from the project root, for example:

```
x402 initialized. Created 3 files:
  - lib/x402/config.ts
  - lib/x402/server.ts
  - .env.example
```

For Fastify projects, the adapter file is also listed:

```
x402 initialized. Created 4 files:
  - lib/x402/config.ts
  - lib/x402/server.ts
  - lib/x402/adapter.ts
  - .env.example
```
