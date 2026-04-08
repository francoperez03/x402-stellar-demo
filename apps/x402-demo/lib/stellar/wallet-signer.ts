import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk";
import type { ClientStellarSigner } from "@x402/stellar";
import type { SignAuthEntry } from "@stellar/stellar-sdk/contract";
import { networkPassphrase } from "./network";

/**
 * Creates a ClientStellarSigner that delegates signing to a browser wallet
 * (Freighter, Hana, etc.) via StellarWalletsKit.
 *
 * This is the bridge between x402's payment system and the user's wallet.
 */
export function createWalletSigner(address: string): ClientStellarSigner {
  const signAuthEntry: SignAuthEntry = async (authEntry, opts) => {
    try {
      const result = await StellarWalletsKit.signAuthEntry(authEntry, {
        address,
        networkPassphrase: opts?.networkPassphrase || networkPassphrase(),
      });

      if (!result.signedAuthEntry) {
        return {
          signedAuthEntry: "",
          error: { message: "Wallet did not return a signed auth entry", code: 0 },
        };
      }

      return {
        signedAuthEntry: result.signedAuthEntry,
        signerAddress: result.signerAddress || address,
      };
    } catch (error) {
      return {
        signedAuthEntry: "",
        error: {
          message: error instanceof Error ? error.message : "Signing failed",
          code: 0,
        },
      };
    }
  };

  return { address, signAuthEntry };
}
