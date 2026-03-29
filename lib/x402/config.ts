import type { RoutesConfig } from "@x402/core/server";
import { NETWORK } from "@/lib/stellar";

export const SERVER_ADDRESS = process.env.SERVER_STELLAR_ADDRESS!;
export const FACILITATOR_URL =
  process.env.FACILITATOR_URL ||
  "https://channels.openzeppelin.com/x402/testnet";
export const FACILITATOR_API_KEY = process.env.FACILITATOR_API_KEY!;

export const PRICE = "$0.001";

export const routesConfig: RoutesConfig = {
  "GET /api/content": {
    accepts: [
      {
        scheme: "exact",
        price: PRICE,
        network: NETWORK,
        payTo: SERVER_ADDRESS,
      },
    ],
    description:
      "Reveal a secret — pay per request with USDC on Stellar",
    mimeType: "application/json",
  },
};
