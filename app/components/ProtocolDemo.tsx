"use client";

import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useX402Payment } from "../hooks/useX402Payment";
import { WalletBar } from "./WalletBar";
import { PaymentActions } from "./PaymentActions";
import { ProtocolTimeline } from "./ProtocolTimeline";

export function ProtocolDemo() {
  const { address, connect, disconnect } = useWallet();
  const { steps, loading, runFlow } = useX402Payment({
    address,
    kitReady: true,
  });
  const [text, setText] = useState("");

  const connected = !!address;

  return (
    <div className="max-w-2xl">
      <WalletBar
        address={address}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <PaymentActions
        text={text}
        onTextChange={setText}
        onJoke={() => runFlow("/api/joke")}
        onSummarize={() => runFlow("/api/summarize", { text })}
        disabled={!connected || loading}
      />

      <ProtocolTimeline steps={steps} loading={loading} />

      {steps.length === 0 && !loading && (
        <div className="py-16 text-gray-400">
          {connected ? (
            <>
              <p className="font-headline text-2xl text-gray-800">
                Press a button to see the x402 flow
              </p>
              <p className="text-sm mt-3 text-gray-500">
                Your wallet will sign the payment using Soroban auth entries
              </p>
            </>
          ) : (
            <>
              <p className="font-headline text-2xl text-gray-800">
                Connect your wallet to get started
              </p>
              <p className="text-sm mt-3 text-gray-500">
                You need Freighter or another Stellar wallet with USDC on
                testnet
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
