# x402-stellar Code Patterns

These are **working, production-tested** patterns extracted from a deployed x402 POC. Use these exact patterns — do not improvise the import paths or class usage.

## Server Pattern (Express + x402 Middleware)

```typescript
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import "dotenv/config";

// 1. Create the facilitator client with auth headers
const facilitatorClient = new HTTPFacilitatorClient({
  url: process.env.FACILITATOR_URL || "https://channels.openzeppelin.com/x402/testnet",
  createAuthHeaders: async () => {
    const headers = { Authorization: `Bearer ${process.env.FACILITATOR_API_KEY}` };
    return { verify: headers, settle: headers, supported: headers };
  },
});

// 2. Create the resource server and register Stellar testnet
const resourceServer = new x402ResourceServer(facilitatorClient).register(
  "stellar:testnet",
  new ExactStellarScheme()
);

// 3. Create Express app
const app = express();
app.use(express.json());

// 4. Add payment middleware with route pricing
app.use(
  paymentMiddleware(
    {
      "POST /api/weather": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.001",
            network: "stellar:testnet",
            payTo: process.env.SERVER_STELLAR_ADDRESS!,
          },
        ],
        description: "Get weather data for a city",
        mimeType: "application/json",
      },
    },
    resourceServer
  )
);

// 5. Define the actual route handler (runs only after payment verified)
app.post("/api/weather", (req, res) => {
  const { city } = req.body;
  res.json({
    city,
    temperature: "22°C",
    condition: "Sunny",
    paid: true,
  });
});

// 6. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`x402 server running on port ${PORT}`);
});
```

### Key Server Details

- `ExactStellarScheme` on the server takes **no arguments** — it only verifies payments.
- The `facilitatorClient` must return auth headers for `verify`, `settle`, and `supported`.
- Route keys in the middleware config must match the HTTP method and path exactly: `"POST /api/weather"`.
- The `price` field uses dollar-prefixed strings: `"$0.001"`, `"$0.01"`, `"$1.00"`.
- The `payTo` address must be a valid Stellar public key (G...) with a USDC trustline.

## Client Pattern (x402 Payment Client)

```typescript
import { createEd25519Signer } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";
import { x402Client, x402HTTPClient } from "@x402/core/client";
import "dotenv/config";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

// 1. Create the signer from the client's secret key
const signer = createEd25519Signer(process.env.CLIENT_STELLAR_SECRET!);

// 2. Create the scheme and register it with the x402 client
const scheme = new ExactStellarScheme(signer);
const client = new x402Client().register("stellar:testnet", scheme);
const httpClient = new x402HTTPClient(client);

async function callPaidEndpoint() {
  // 3. Make the initial request (will get 402)
  const initialResponse = await fetch(`${SERVER_URL}/api/weather`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city: "Buenos Aires" }),
  });

  if (initialResponse.status !== 402) {
    // Either succeeded without payment or got an error
    console.log("Status:", initialResponse.status);
    console.log("Body:", await initialResponse.text());
    return;
  }

  // 4. Parse the 402 response to get payment requirements
  const paymentRequired = httpClient.getPaymentRequiredResponse(
    (name: string) => initialResponse.headers.get(name)
  );

  console.log("Payment required:", JSON.stringify(paymentRequired, null, 2));

  // 5. Create the payment payload (signs the transaction)
  const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);

  // 6. Encode the payment into headers
  const paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);

  // 7. Resend the request with payment headers
  const paidResponse = await fetch(`${SERVER_URL}/api/weather`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...paymentHeaders,
    },
    body: JSON.stringify({ city: "Buenos Aires" }),
  });

  console.log("Paid response status:", paidResponse.status);
  console.log("Paid response body:", await paidResponse.json());
}

callPaidEndpoint().catch(console.error);
```

### Key Client Details

- `ExactStellarScheme` on the client takes the **signer** as an argument.
- Import from `@x402/stellar/exact/client` — NOT from `@x402/stellar/exact/server`.
- The `getPaymentRequiredResponse` method takes a header getter function.
- The `encodePaymentSignatureHeader` returns an object that can be spread into fetch headers.
- The client account must have USDC balance and a USDC trustline.

## Multi-Endpoint Pricing Pattern

```typescript
app.use(
  paymentMiddleware(
    {
      "POST /api/weather": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.001",
            network: "stellar:testnet",
            payTo: process.env.SERVER_STELLAR_ADDRESS!,
          },
        ],
        description: "Get weather data",
        mimeType: "application/json",
      },
      "GET /api/premium-data": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.01",
            network: "stellar:testnet",
            payTo: process.env.SERVER_STELLAR_ADDRESS!,
          },
        ],
        description: "Access premium dataset",
        mimeType: "application/json",
      },
      "POST /api/ai-summary": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.05",
            network: "stellar:testnet",
            payTo: process.env.SERVER_STELLAR_ADDRESS!,
          },
        ],
        description: "AI-generated summary",
        mimeType: "application/json",
      },
    },
    resourceServer
  )
);
```

Different endpoints can have different prices. Unprotected routes are not listed in the middleware config and work normally without payment.

## Error Handling Patterns

### Server-Side Error Handling

```typescript
// Wrap route handlers to catch errors after payment verification
app.post("/api/weather", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: "City parameter required" });
    }
    // Process and respond
    res.json({ city, temperature: "22°C" });
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

### Client-Side Error Handling

```typescript
async function callWithRetry(url: string, options: RequestInit, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 402) {
        // Parse payment requirements and pay
        const paymentRequired = httpClient.getPaymentRequiredResponse(
          (name: string) => response.headers.get(name)
        );
        const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);
        const paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);

        // Resend with payment
        const paidResponse = await fetch(url, {
          ...options,
          headers: { ...options.headers, ...paymentHeaders },
        });

        if (!paidResponse.ok) {
          throw new Error(`Payment accepted but request failed: ${paidResponse.status}`);
        }
        return paidResponse;
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.warn(`Attempt ${attempt + 1} failed, retrying...`);
    }
  }
}
```

### Checking Payment Status

```typescript
// The payment middleware adds payment info to the request
// Access it in your route handler if needed
app.post("/api/weather", (req, res) => {
  // The request only reaches here if payment was verified
  // You can log payment details from the x-payment header
  const paymentHeader = req.headers["x-payment"];
  console.log("Payment received:", paymentHeader ? "yes" : "no");

  res.json({ city: req.body.city, temperature: "22°C", paid: true });
});
```
