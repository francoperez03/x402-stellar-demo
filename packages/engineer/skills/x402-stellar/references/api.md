# x402-stellar API Reference

## @x402/express

Express middleware for x402 payment verification and settlement.

### `paymentMiddleware(routeConfig, resourceServer)`

Creates Express middleware that intercepts requests matching configured routes and requires payment before allowing them through.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `routeConfig` | `Record<string, RoutePaymentConfig>` | Map of `"METHOD /path"` to payment configuration |
| `resourceServer` | `x402ResourceServer` | Configured resource server instance |

**RoutePaymentConfig:**

```typescript
interface RoutePaymentConfig {
  accepts: PaymentAccept[];
  description: string;
  mimeType: string;
}

interface PaymentAccept {
  scheme: "exact";          // Payment scheme identifier
  price: string;            // Dollar-prefixed price: "$0.001"
  network: string;          // Network identifier: "stellar:testnet"
  payTo: string;            // Stellar public key (G...)
}
```

**Returns:** Express middleware function.

**Behavior:**
- Requests to unconfigured routes pass through without payment.
- Requests to configured routes without valid payment receive HTTP 402 with payment requirements in headers.
- Requests with valid payment are verified, then passed to the next handler.
- After the response is sent, payment is settled via the facilitator.

### `x402ResourceServer`

Manages payment scheme registration and facilitator communication.

```typescript
const resourceServer = new x402ResourceServer(facilitatorClient);
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `register` | `(network: string, scheme: SchemeInstance) => this` | Register a payment scheme for a network. Returns `this` for chaining. |

**Example:**

```typescript
const resourceServer = new x402ResourceServer(facilitatorClient)
  .register("stellar:testnet", new ExactStellarScheme());
```

---

## @x402/stellar

Stellar-specific signers and payment scheme implementations.

### `createEd25519Signer(secretKey)`

Creates a Stellar Ed25519 signer from a secret key. Used on the **client side** to sign payment transactions.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `secretKey` | `string` | Stellar secret key (S..., 56 characters) |

**Returns:** `Ed25519Signer` — signer object compatible with `ExactStellarScheme`.

```typescript
import { createEd25519Signer } from "@x402/stellar";

const signer = createEd25519Signer("SCZANGBA5YHTNYVVV3C7CAZMCLP...");
```

### `ExactStellarScheme` (Server)

**Import:** `@x402/stellar/exact/server`

Server-side scheme for verifying and settling Stellar payments. Takes **no constructor arguments**.

```typescript
import { ExactStellarScheme } from "@x402/stellar/exact/server";

const scheme = new ExactStellarScheme();
// Register with resource server
resourceServer.register("stellar:testnet", scheme);
```

### `ExactStellarScheme` (Client)

**Import:** `@x402/stellar/exact/client`

Client-side scheme for creating and signing Stellar payment transactions. Takes a **signer** as constructor argument.

```typescript
import { ExactStellarScheme } from "@x402/stellar/exact/client";
import { createEd25519Signer } from "@x402/stellar";

const signer = createEd25519Signer(process.env.CLIENT_STELLAR_SECRET!);
const scheme = new ExactStellarScheme(signer);
// Register with x402 client
client.register("stellar:testnet", scheme);
```

> **Critical:** Do not confuse the server and client `ExactStellarScheme`. They share the same class name but have different import paths and different constructor signatures.

---

## @x402/core

Core x402 protocol utilities shared between server and client.

### `HTTPFacilitatorClient` (Server)

**Import:** `@x402/core/server`

HTTP client for communicating with the OpenZeppelin facilitator service.

```typescript
import { HTTPFacilitatorClient } from "@x402/core/server";

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://channels.openzeppelin.com/x402/testnet",
  createAuthHeaders: async () => {
    const headers = { Authorization: `Bearer ${apiKey}` };
    return { verify: headers, settle: headers, supported: headers };
  },
});
```

**Constructor Options:**

| Option | Type | Description |
|--------|------|-------------|
| `url` | `string` | Facilitator service URL |
| `createAuthHeaders` | `() => Promise<AuthHeaders>` | Async function returning auth headers for each operation |

**AuthHeaders:**

```typescript
interface AuthHeaders {
  verify: Record<string, string>;   // Headers for payment verification requests
  settle: Record<string, string>;   // Headers for payment settlement requests
  supported: Record<string, string>; // Headers for supported schemes requests
}
```

### `x402Client` (Client)

**Import:** `@x402/core/client`

Core client for managing payment schemes and creating payments.

```typescript
import { x402Client } from "@x402/core/client";

const client = new x402Client();
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `register` | `(network: string, scheme: SchemeInstance) => this` | Register a payment scheme for a network |

### `x402HTTPClient` (Client)

**Import:** `@x402/core/client`

HTTP-aware client that handles 402 response parsing and payment header encoding.

```typescript
import { x402HTTPClient } from "@x402/core/client";

const httpClient = new x402HTTPClient(client);
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `getPaymentRequiredResponse` | `(headerGetter: (name: string) => string \| null) => PaymentRequired` | Parse 402 response headers into payment requirements |
| `createPaymentPayload` | `(paymentRequired: PaymentRequired) => Promise<PaymentPayload>` | Create and sign a payment transaction |
| `encodePaymentSignatureHeader` | `(payload: PaymentPayload) => Record<string, string>` | Encode payment into HTTP headers for the retry request |

**Usage Flow:**

```typescript
// 1. Parse 402 headers
const paymentRequired = httpClient.getPaymentRequiredResponse(
  (name) => response.headers.get(name)
);

// 2. Create payment (signs Stellar transaction)
const payload = await httpClient.createPaymentPayload(paymentRequired);

// 3. Encode as headers
const headers = httpClient.encodePaymentSignatureHeader(payload);

// 4. Resend request with payment headers
const paidResponse = await fetch(url, { headers: { ...originalHeaders, ...headers } });
```

---

## Network Identifiers

| Identifier | Network | Use Case |
|------------|---------|----------|
| `stellar:testnet` | Stellar Testnet | Development and testing |
| `stellar:pubnet` | Stellar Mainnet | Production |

## Price Format

Prices are specified as dollar-prefixed strings:

| Format | Value |
|--------|-------|
| `"$0.001"` | One-tenth of a cent |
| `"$0.01"` | One cent |
| `"$0.10"` | Ten cents |
| `"$1.00"` | One dollar |

The middleware converts these to the appropriate USDC amount for the Stellar transaction.
