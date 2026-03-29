import {
  HTTPFacilitatorClient,
  x402ResourceServer,
  x402HTTPResourceServer,
} from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { NETWORK } from "@/lib/stellar";
import { NextRequestAdapter } from "./adapter";
import {
  FACILITATOR_URL,
  FACILITATOR_API_KEY,
  routesConfig,
} from "./config";

// Singleton — initialized lazily on first request
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

/**
 * Wraps a Next.js Route Handler with x402 payment verification.
 *
 * Usage:
 *   export async function GET(req: Request) {
 *     return withPayment(req, () => Response.json({ data: "..." }));
 *   }
 */
export async function withPayment(
  req: Request,
  handler: () => Response | Promise<Response>,
  parsedBody?: unknown
): Promise<Response> {
  const server = await ensureInitialized();

  const adapter = new NextRequestAdapter(req, parsedBody);
  const context = {
    adapter,
    path: adapter.getPath(),
    method: adapter.getMethod(),
    paymentHeader:
      adapter.getHeader("x-payment") ??
      adapter.getHeader("x-payment-signature"),
  };

  const result = await server.processHTTPRequest(context);

  if (result.type === "no-payment-required") {
    return handler();
  }

  if (result.type === "payment-error") {
    const { status, headers, body, isHtml } = result.response;
    const responseBody = isHtml
      ? (body as string)
      : JSON.stringify(body ?? {});
    const contentType = isHtml ? "text/html" : "application/json";

    return new Response(responseBody, {
      status,
      headers: { ...headers, "Content-Type": contentType },
    });
  }

  // payment-verified — run handler then settle
  const response = await handler();

  const responseClone = response.clone();
  const responseBody = Buffer.from(await responseClone.arrayBuffer());

  const settleResult = await server.processSettlement(
    result.paymentPayload,
    result.paymentRequirements,
    result.declaredExtensions,
    { request: context, responseBody }
  );

  const finalHeaders = new Headers(response.headers);
  if (settleResult.success) {
    for (const [key, value] of Object.entries(settleResult.headers)) {
      finalHeaders.set(key, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    headers: finalHeaders,
  });
}
