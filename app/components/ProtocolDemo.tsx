"use client";

import { useEffect, useRef } from "react";
import { useWallet, useX402Payment, useUsdcBalance } from "../hooks";
import { WalletBar } from "./WalletBar";
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

  // Refetch balance when a payment flow finishes
  const prevLoading = useRef(false);
  useEffect(() => {
    if (prevLoading.current && !loading) {
      refetch();
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
