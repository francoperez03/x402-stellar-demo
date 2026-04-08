# Hono Server Template

Uses the official `@x402/hono` package with `paymentMiddleware`.

```typescript
import { paymentMiddleware } from "@x402/hono";
import { x402ResourceServer } from "@x402/core/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import {
  routesConfig,
  FACILITATOR_URL,
  FACILITATOR_API_KEY,
  NETWORK,
} from "./config";

const facilitatorClient = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
  createAuthHeaders: async () => {
    const headers = { Authorization: `Bearer ${FACILITATOR_API_KEY}` };
    return { verify: headers, settle: headers, supported: headers };
  },
});

const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactStellarScheme()
);

export const x402Middleware = paymentMiddleware(routesConfig, resourceServer);
```
