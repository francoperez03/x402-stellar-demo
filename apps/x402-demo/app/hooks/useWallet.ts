"use client";

import { useCallback, useEffect, useState } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { HanaModule } from "@creit.tech/stellar-wallets-kit/modules/hana";
import type { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { networkPassphrase } from "@/lib/stellar";

export function useWallet() {
  const [kitReady, setKitReady] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    try {
      StellarWalletsKit.init({
        network: networkPassphrase() as Networks,
        modules: [new FreighterModule(), new HanaModule()],
      });
      setKitReady(true);
    } catch (error) {
      console.error("Failed to initialize Stellar Wallet Kit", error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!kitReady) return;

    try {
      const { address: walletAddress } = await StellarWalletsKit.authModal();
      if (!walletAddress) throw new Error("No address returned");

      const { networkPassphrase: walletNetwork } =
        await StellarWalletsKit.getNetwork();
      if (walletNetwork !== networkPassphrase()) {
        throw new Error("Please switch your wallet to Testnet network");
      }

      setAddress(walletAddress);
    } catch (error) {
      console.error("Wallet connection failed", error);
      setAddress(null);
    }
  }, [kitReady]);

  const disconnect = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
      // ignore
    }
    setAddress(null);
  }, []);

  return { kitReady, address, connect, disconnect };
}
