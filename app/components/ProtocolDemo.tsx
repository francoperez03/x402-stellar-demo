"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet, useX402Payment, useUsdcBalance } from "../hooks";
import { WalletBar } from "./WalletBar";
import { ServerBalance } from "./ServerBalance";
import { PaymentActions } from "./PaymentActions";
import { ProtocolFlowDiagram } from "./flow";
import { SecretReveal } from "./SecretReveal";

export function ProtocolDemo() {
  const { address, connect, disconnect } = useWallet();
  const { steps, loading, runFlow } = useX402Payment({
    address,
    kitReady: true,
  });
  const { balance, refetch } = useUsdcBalance(address);
  const [serverRefetchKey, setServerRefetchKey] = useState(0);

  // Refetch balances when a payment flow finishes
  const prevLoading = useRef(false);
  useEffect(() => {
    if (prevLoading.current && !loading) {
      refetch();
      setServerRefetchKey((k) => k + 1);
    }
    prevLoading.current = loading;
  }, [loading, refetch]);

  const connected = !!address;

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <h2 className="font-headline text-2xl text-black mb-6">Try it</h2>

      <WalletBar
        address={address}
        balance={balance}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <ServerBalance refetchKey={serverRefetchKey} />

      <PaymentActions
        onReveal={() => runFlow("/api/content")}
        disabled={!connected || loading}
      />

      {/* Horizontal protocol flow — full width */}
      <div className="w-full">
        <ProtocolFlowDiagram steps={steps} loading={loading} />
      </div>

      <SecretReveal steps={steps} />
    </div>
  );
}
