"use client";

import { useCallback, useEffect, useState } from "react";

const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";

export function useUsdcBalance(address: string | null) {
  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(null);
      return;
    }

    try {
      const res = await fetch(`${HORIZON_TESTNET}/accounts/${address}`);
      if (!res.ok) {
        setBalance(null);
        return;
      }

      const account = await res.json();
      const usdc = account.balances?.find(
        (b: { asset_code?: string }) => b.asset_code === "USDC"
      );

      setBalance(usdc ? usdc.balance : "0");
    } catch {
      setBalance(null);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, refetch: fetchBalance };
}
