---
name: x402-add-paywall
description: Wrap an API endpoint with x402 payment protection. Detects endpoints, adds middleware wrapping, and updates route config.
user-invocable: true
disable-model-invocation: true
argument-hint: "[endpoint-path]"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# /x402:add-paywall

> Protect an API endpoint with x402 payment middleware. I'll detect your endpoints, let you choose which to protect, and handle the wrapping.

## Step 1 -- Verify x402 is initialized

Use Grep to check if `@x402/core` exists in `package.json` dependencies:

```
Grep: pattern="@x402/core" in package.json
```

**If NOT found:** Output exactly:

> "No x402 configuration detected. Run /x402:init first."

Then STOP. Do not proceed.

**If found:** Continue. Use Glob and Grep to locate the project's x402 files:

1. Find the routesConfig file: Use Grep to search for files containing `RoutesConfig` or `routesConfig`:
   ```
   Grep: pattern="routesConfig" glob="**/*.{ts,js}" (exclude node_modules)
   ```

2. Find the server/middleware file: Use Grep to search for files importing `x402ResourceServer` or `paymentMiddleware` or `withPayment`:
   ```
   Grep: pattern="withPayment|paymentMiddleware|x402ResourceServer" glob="**/*.{ts,js}" (exclude node_modules)
   ```

Store both file paths for later use.

## Step 2 -- Detect framework

Read `package.json` and check `dependencies` for the framework:

1. `"next"` in dependencies -> **Next.js App Router**
2. `"express"` in dependencies -> **Express**
3. `"fastify"` in dependencies -> **Fastify**
4. `"hono"` in dependencies -> **Hono**

Priority if multiple detected: Next.js > Express > Fastify > Hono.

If no supported framework found, output:

> "Could not detect framework from package.json. Supported: Next.js, Express, Fastify, Hono."

Then STOP.

## Step 3 -- Discover API endpoints

Read [references/patterns.md](references/patterns.md) for the framework-specific endpoint detection approach.

**Next.js App Router:**
- Use Glob to find `**/app/api/**/route.{ts,js}` files
- For each found file, Read it and extract the exported HTTP method handlers (look for `export async function GET`, `export async function POST`, `export const GET`, `export const POST`, etc. for GET, POST, PUT, PATCH, DELETE)
- Build a list of `"METHOD /path"` entries where the path is derived from the file's directory structure relative to `app/` (e.g., `app/api/content/route.ts` -> `/api/content`)

**Express:**
- Use Grep to find route registrations: `app.get(`, `app.post(`, `app.put(`, `app.patch(`, `app.delete(`, `router.get(`, `router.post(`, `router.put(`, `router.patch(`, `router.delete(`
- Extract the path argument (first string argument) from each match
- Build a list of `"METHOD /path"` entries

**Fastify:**
- Use Grep to find route registrations: `fastify.get(`, `fastify.post(`, `fastify.put(`, `fastify.patch(`, `fastify.delete(`, `fastify.route(`
- Extract the path argument from each match
- Build a list of `"METHOD /path"` entries

**Hono:**
- Use Grep to find route registrations: `app.get(`, `app.post(`, `app.put(`, `app.patch(`, `app.delete(`, `app.route(`
- Extract the path argument from each match
- Build a list of `"METHOD /path"` entries

**If no endpoints found:** Output exactly:

> "No API endpoints found in this project. Create an endpoint first, then run /x402:add-paywall."

Then STOP.

## Step 4 -- Check protection status

For each discovered endpoint, determine if it is already protected:

**Next.js (inline wrap):**
- Read the route file
- Check if it contains the `// x402: payment-protected endpoint` comment
- Check if it imports `withPayment` or `withX402`
- If either found: mark as **PROTECTED**

**Express / Fastify / Hono (middleware):**
- Read the routesConfig file found in Step 1
- Check if `"METHOD /path"` already exists as a key in routesConfig
- If found: mark as **PROTECTED** and note the current price and network

**All frameworks:**
- Always check routesConfig for an existing `"METHOD /path"` key regardless of framework

## Step 5 -- Present endpoint list

Output exactly (replacing `{N}` with the count):

> "Found {N} API endpoints. Select which to protect:"

Then display a numbered list showing protection status:

```
1. [PROTECTED] GET /api/content ($0.001 USDC)
2. [          ] POST /api/data
3. [          ] GET /api/users
```

Protected endpoints show the current price. Unprotected endpoints have empty brackets.

**Argument handling:** If `$ARGUMENTS` provides an endpoint path (e.g., the user ran `/x402:add-paywall /api/data`), auto-select that endpoint instead of presenting the full list. If the argument matches multiple methods for the same path, select all of them.

**If ALL endpoints are already protected:** Output exactly:

> "All selected endpoints are already protected. No changes made."

Then STOP.

## Step 6 -- Wrap selected endpoint(s)

Read [references/patterns.md](references/patterns.md) for the framework-specific wrapping approach.

### Next.js App Router (inline wrap)

For each selected unprotected endpoint:

1. **Read the route file** -- always read before editing (never assume file state)
2. **Add import** -- if `withPayment` or `withX402` is not already imported, add the import:
   ```typescript
   import { withPayment } from "{relative_path_to_server}";
   ```
   Use the path to the x402 server file found in Step 1. Preserve existing imports -- do not duplicate.
3. **Add marker comment** -- add `// x402: payment-protected endpoint` above the handler function
4. **Wrap the handler** -- wrap the handler's body with `withPayment(req, () => { ... original handler ... })`:
   ```typescript
   // x402: payment-protected endpoint
   export async function GET(req: Request) {
     return withPayment(req, () => {
       // ... original handler body ...
     });
   }
   ```
5. **Use Edit tool** to apply changes to the route file

### Express / Fastify / Hono (middleware)

For middleware-based frameworks, no route file changes are needed -- the middleware intercepts all routes listed in routesConfig.

1. **Check middleware registration** -- Read the app setup file and verify middleware is registered:
   - Express: `app.use(paymentMiddleware(...))` or `app.use(x402Middleware)`
   - Fastify: `fastify.register(x402PaymentPlugin, ...)`
   - Hono: `app.use(paymentMiddleware(...))` or `app.use(x402Middleware)`
2. **If middleware not registered** -- add it to the app setup file (check first for idempotency)

### All frameworks -- Add routesConfig entry

For EVERY selected unprotected endpoint, regardless of framework:

1. **Read the routesConfig file** found in Step 1
2. **Add a new entry** using the Edit tool:
   ```typescript
   "METHOD /path": {
     accepts: [
       {
         scheme: "exact",
         price: "$0.001",
         network: NETWORK,
         payTo: SERVER_ADDRESS,
       },
     ],
     description: "Description of endpoint",
     mimeType: "application/json",
   },
   ```
3. **Price default:** Use `"$0.001"` (dollar-sign prefix required) unless the user specifies a different price
4. **Key format:** `"METHOD /path"` (e.g., `"GET /api/content"`, `"POST /api/data"`)

## Step 7 -- Confirm

For each endpoint that was successfully protected, output exactly (replacing `{path}` with the endpoint path):

> "Protected {path} with x402 paywall. Price: $0.001 USDC per request."

If an endpoint was already protected and skipped, output exactly:

> "Endpoint {path} is already protected (price: {price} {asset}, network: {network}). No changes made."

## Important Rules

- **Idempotency is critical.** Always check for existing protection before making changes. Running this command twice on the same endpoint must produce no changes the second time.
- **Always read before editing.** Use the Read tool on every file before modifying it. Never assume file contents.
- **Preserve existing code.** When wrapping Next.js handlers, keep all existing imports, types, and logic intact. Only add the `withPayment` wrapper and marker comment.
- **For Express/Hono/Fastify:** Only modify routesConfig to add the route entry. Do NOT modify individual route handler files -- the middleware handles interception automatically.
- **Price format:** Always use dollar-prefixed strings (e.g., `"$0.001"`, not `"0.001"`).
- **routesConfig key format:** Always use `"METHOD /path"` (e.g., `"GET /api/content"`).
- **Marker comment:** Use exactly `// x402: payment-protected endpoint` -- this is the idempotency detection marker for Next.js routes.
