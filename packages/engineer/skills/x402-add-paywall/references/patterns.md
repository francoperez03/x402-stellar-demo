# x402 Endpoint Wrapping Patterns

Reference for framework-specific x402 payment protection patterns. Read this before modifying any route files or middleware configuration.

## Wrapping Strategy by Framework

### Next.js App Router -- Inline Wrap

Next.js route handlers must be wrapped individually because there is no global middleware interception point in App Router.

**Pattern:** Import `withX402` (or `withPayment`) and wrap the exported handler function.

**Using @x402/next (official):**

```typescript
import { withX402 } from "../lib/x402/server";
import { routesConfig, resourceServer } from "../lib/x402/server";

// x402: payment-protected endpoint
export const GET = withX402(
  async (req: Request) => {
    return Response.json({ data: "protected content" });
  },
  routesConfig,
  resourceServer,
);
```

**Using custom withPayment (demo pattern):**

```typescript
import { withPayment } from "@/lib/x402/server";

// x402: payment-protected endpoint
export async function GET(req: Request) {
  return withPayment(req, () => {
    return Response.json({ data: "protected content" });
  });
}
```

**Endpoint detection:** Scan `app/api/` (or `src/app/api/`) recursively for `route.ts` or `route.js` files. Each file may export GET, POST, PUT, PATCH, DELETE handlers.

### Express -- Middleware Registration

Express uses global middleware. No changes to route handler files needed.

**Pattern:** The `paymentMiddleware` from `@x402/express` intercepts all routes defined in `routesConfig`.

```typescript
// In app setup (e.g., server.ts or app.ts)
import { paymentMiddleware } from "@x402/express";
import { routesConfig, resourceServer } from "./lib/x402/server";

app.use(paymentMiddleware(routesConfig, resourceServer));
```

**Endpoint detection:** Grep for `app.get(`, `app.post(`, `app.put(`, `app.patch(`, `app.delete(`, `router.get(`, `router.post(`, `router.put(`, `router.patch(`, `router.delete(` etc.

### Fastify -- Plugin Registration

Fastify uses a plugin. No changes to route handler files needed.

**Pattern:** The custom `x402PaymentPlugin` intercepts all routes defined in `routesConfig`. Since `@x402/fastify` is not published on npm, use `@x402/core` directly with a custom `FastifyAdapter`.

```typescript
// In app setup (e.g., server.ts or app.ts)
import { x402PaymentPlugin } from "./lib/x402/server";

fastify.register(x402PaymentPlugin, { routesConfig, resourceServer });
```

**Endpoint detection:** Grep for `fastify.get(`, `fastify.post(`, `fastify.put(`, `fastify.patch(`, `fastify.delete(`, `fastify.route(` etc.

### Hono -- Middleware Registration

Hono uses global middleware. No changes to route handler files needed.

**Pattern:** The `paymentMiddleware` from `@x402/hono` intercepts all routes defined in `routesConfig`.

```typescript
// In app setup (e.g., index.ts or app.ts)
import { paymentMiddleware } from "@x402/hono";
import { routesConfig, resourceServer } from "./lib/x402/server";

app.use(paymentMiddleware(routesConfig, resourceServer));
```

**Endpoint detection:** Grep for `app.get(`, `app.post(`, `app.put(`, `app.patch(`, `app.delete(`, `app.route(` etc.

## routesConfig Entry Format

Every protected endpoint needs an entry in routesConfig:

```typescript
"METHOD /path": {
  accepts: [
    {
      scheme: "exact",
      price: "$0.001",
      network: "stellar:testnet",
      payTo: SERVER_ADDRESS,
    },
  ],
  description: "Description of what this endpoint does",
  mimeType: "application/json",
},
```

**Key details:**
- The key format is `"METHOD /path"` (e.g., `"GET /api/content"`, `"POST /api/data"`)
- `price` must include the dollar-sign prefix (e.g., `"$0.001"`, not `"0.001"`)
- `network` is `"stellar:testnet"` for development, `"stellar:mainnet"` for production
- `payTo` is the Stellar public key (G...) that receives USDC payments
- `scheme` is `"exact"` for fixed-price payments

## Idempotency Detection

Before making any changes, check if an endpoint is already protected.

**For Next.js (inline wrap):**
- Check if route file contains `// x402: payment-protected endpoint` comment
- Check if route file imports `withPayment` or `withX402`
- If either found: endpoint is already protected -- do not wrap again

**For Express/Fastify/Hono (middleware):**
- Check if routesConfig already contains the `"METHOD /path"` entry
- If found: endpoint is already protected -- do not add duplicate entry

**For all frameworks:**
- Check routesConfig for existing `"METHOD /path"` key before adding a new entry
- If the key exists, report the current price and network, skip with no changes
