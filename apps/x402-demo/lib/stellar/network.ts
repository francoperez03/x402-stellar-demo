import { getNetworkPassphrase } from "@x402/stellar";
import type { Network } from "@x402/core/types";

export const NETWORK: Network = "stellar:testnet";

export function networkPassphrase(): string {
  return getNetworkPassphrase(NETWORK);
}
