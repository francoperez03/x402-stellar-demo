# Fastify Server Template

Uses `@x402/core` directly because `@x402/fastify` is not published on npm.
Implements a custom Fastify plugin with the `FastifyAdapter` class.

```typescript
import {
  HTTPFacilitatorClient,
  x402ResourceServer,
  x402HTTPResourceServer,
} from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { FastifyAdapter } from "./adapter";
import {
  routesConfig,
  FACILITATOR_URL,
  FACILITATOR_API_KEY,
  NETWORK,
} from "./config";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

let httpServer: x402HTTPResourceServer | null = null;
let initPromise: Promise<void> | null = null;

function getHTTPServer(): x402HTTPResourceServer {
  if (!httpServer) {
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
    httpServer = new x402HTTPResourceServer(resourceServer, routesConfig);
  }
  return httpServer;
}

async function ensureInitialized(): Promise<x402HTTPResourceServer> {
  const server = getHTTPServer();
  if (!initPromise) {
    initPromise = server.initialize().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  await initPromise;
  return server;
}

export async function x402PaymentPlugin(fastify: FastifyInstance) {
  fastify.addHook(
    "onRequest",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const server = await ensureInitialized();
      const adapter = new FastifyAdapter(req);
      const context = {
        adapter,
        path: adapter.getPath(),
        method: adapter.getMethod(),
        paymentHeader:
          adapter.getHeader("x-payment") ??
          adapter.getHeader("x-payment-signature"),
      };
      const result = await server.processHTTPRequest(context);

      if (result.type === "payment-error") {
        const { status, headers, body, isHtml } = result.response;
        const responseBody = isHtml
          ? (body as string)
          : JSON.stringify(body ?? {});
        const contentType = isHtml ? "text/html" : "application/json";
        reply
          .status(status)
          .headers({ ...headers, "Content-Type": contentType })
          .send(responseBody);
        return reply;
      }

      if (result.type === "payment-verified") {
        (req as any).__x402Result = result;
      }
    }
  );
}
```
