# Express Server Template

Uses the official `@x402/express` package with `paymentMiddleware`.

```typescript
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
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
