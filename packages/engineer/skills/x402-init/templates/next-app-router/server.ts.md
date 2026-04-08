# Next.js App Router Server Template

Uses the official `@x402/next` package with `withX402` wrapper.

```typescript
import { withX402 } from "@x402/next";
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

export { withX402, routesConfig, resourceServer };
```
