# x402-stellar Setup Reference

## 1. Create a Stellar Testnet Account

Use the Stellar Laboratory to create and fund a testnet account.

### Via Stellar Laboratory (recommended)

1. Go to https://laboratory.stellar.org/#account-creator?network=test
2. Click "Generate Keypair" — save both the **Public Key** (G...) and **Secret Key** (S...)
3. Click "Fund account on testnet" to receive 10,000 test XLM from Friendbot

### Via CLI

```bash
curl -s "https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY" | jq .
```

### Via Stellar SDK

```typescript
import { Keypair } from "@stellar/stellar-sdk";

const keypair = Keypair.random();
console.log("Public:", keypair.publicKey());   // G...
console.log("Secret:", keypair.secret());      // S...

// Fund on testnet
await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
```

You need **two accounts**:
- **Server account** — receives USDC payments (use the Public Key as `SERVER_STELLAR_ADDRESS`)
- **Client account** — signs and sends payments (use the Secret Key as `CLIENT_STELLAR_SECRET`)

## 2. Get OpenZeppelin Facilitator API Key

The facilitator verifies and settles x402 payments on behalf of your server.

1. Go to https://channels.openzeppelin.com/testnet/gen
2. Generate a new API key
3. Save the key as `FACILITATOR_API_KEY` in your `.env`

The facilitator URL for testnet is:
```
https://channels.openzeppelin.com/x402/testnet
```

For mainnet, use:
```
https://channels.openzeppelin.com/x402/mainnet
```

## 3. Environment Variable Reference

| Variable | Format | Description | Where to Get It |
|----------|--------|-------------|-----------------|
| `SERVER_STELLAR_ADDRESS` | `G...` (56 chars) | Public key of the account receiving payments | Stellar Laboratory or SDK keypair generation |
| `FACILITATOR_URL` | URL | OpenZeppelin facilitator endpoint | `https://channels.openzeppelin.com/x402/testnet` |
| `FACILITATOR_API_KEY` | String | API key for the facilitator service | `channels.openzeppelin.com/testnet/gen` |
| `CLIENT_STELLAR_SECRET` | `S...` (56 chars) | Secret key of the account making payments | Stellar Laboratory or SDK keypair generation |

### Example `.env` file

```env
# Server configuration
SERVER_STELLAR_ADDRESS=GBZXN7PIRZGNMHGA7MUUUF4GWZPWTQVL6NKRTZSKU74AQKLLP5LCBUS
FACILITATOR_URL=https://channels.openzeppelin.com/x402/testnet
FACILITATOR_API_KEY=oz_fac_abc123def456

# Client configuration
CLIENT_STELLAR_SECRET=SCZANGBA5YHTNYVVV3C7CAZMCLP4JMQ3HZRQMIV6ILWLHYZPXTLCWBI
```

## 4. Fund Testnet Account with USDC

Testnet USDC is needed for the client account to make payments.

### Step 1: Add USDC Trustline

Before an account can hold USDC, it must establish a trustline to the USDC issuer.

**Testnet USDC issuer:** `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`

```typescript
import {
  Keypair,
  Server,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
} from "@stellar/stellar-sdk";

const server = new Server("https://horizon-testnet.stellar.org");
const keypair = Keypair.fromSecret(process.env.CLIENT_STELLAR_SECRET!);
const account = await server.loadAccount(keypair.publicKey());

const usdcAsset = new Asset(
  "USDC",
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
);

const tx = new TransactionBuilder(account, {
  fee: "100",
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(Operation.changeTrust({ asset: usdcAsset }))
  .setTimeout(30)
  .build();

tx.sign(keypair);
await server.submitTransaction(tx);
console.log("USDC trustline added");
```

### Step 2: Get Testnet USDC

Use the testnet USDC faucet or transfer from a funded testnet account. Check the Stellar Laboratory for testnet USDC distribution tools.

You can also use the Stellar Laboratory to manually add a trustline:
1. Go to https://laboratory.stellar.org/#txbuilder?network=test
2. Set source account to your client public key
3. Add a "Change Trust" operation with USDC asset and the testnet issuer
4. Sign and submit

## 5. Verify Setup

Run the dependency checker script to validate everything is configured:

```bash
node scripts/check-deps.js
```

This checks:
- All @x402 packages are installed
- All required environment variables are set
- Variable formats are correct (G... for public keys, S... for secrets)
