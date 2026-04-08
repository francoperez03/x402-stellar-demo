"use client";

import { useCallback, useMemo, useState } from "react";
import { ExactStellarScheme } from "@x402/stellar/exact/client";
import { x402Client, x402HTTPClient } from "@x402/core/client";
import { NETWORK, createWalletSigner } from "@/lib/stellar";
import type { StepData } from "@x402/engineer";

interface UseX402PaymentParams {
  address: string | null;
  kitReady: boolean;
}

export function useX402Payment({ address, kitReady }: UseX402PaymentParams) {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [loading, setLoading] = useState(false);

  const walletSigner = useMemo(() => {
    if (!address || !kitReady) return null;
    return createWalletSigner(address);
  }, [address, kitReady]);

  const runFlow = useCallback(
    async (endpoint: string, body?: Record<string, unknown>) => {
      if (!walletSigner) return;

      setSteps([]);
      setLoading(true);
      const startTime = Date.now();

      const emit = (
        step: number,
        label: string,
        status: "success" | "error",
        detail: Record<string, unknown>,
        request?: StepData["request"]
      ) => {
        const entry: StepData = {
          step,
          label,
          status,
          detail,
          request,
          timestamp: Date.now(),
          elapsed: Date.now() - startTime,
        };
        setSteps((prev) => [...prev, entry]);
      };

      try {
        const method = body ? "POST" : "GET";
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // Step 1: Initial request
        emit(1, "Request sent (no payment)", "success", {
          method,
          url: endpoint,
        }, { method, url: endpoint, body });

        const res1 = await fetch(endpoint, {
          method,
          headers,
          ...(body ? { body: JSON.stringify(body) } : {}),
        });

        if (res1.status !== 402) {
          const data = await res1.json();
          emit(
            2,
            `Response ${res1.status} (no payment required)`,
            "success",
            data
          );
          setLoading(false);
          return;
        }

        // Step 2: Parse 402
        const scheme = new ExactStellarScheme(walletSigner);
        const client = new x402Client().register(NETWORK, scheme);
        const httpClient = new x402HTTPClient(client);

        const paymentRequired = httpClient.getPaymentRequiredResponse(
          (name: string) => res1.headers.get(name)
        );

        emit(2, "402 Payment Required received", "success", {
          price: paymentRequired.accepts?.[0]?.amount ?? "?",
          network: NETWORK,
          scheme: "exact",
          payTo: paymentRequired.accepts?.[0]?.payTo ?? "?",
        });

        // Step 3: Sign with wallet
        emit(3, "Signing auth entry with wallet...", "success", {
          signer: "Wallet (Freighter/Hana)",
          address: walletSigner.address,
          note: "Wallet will request approval",
        });

        const paymentPayload =
          await httpClient.createPaymentPayload(paymentRequired);

        // Step 4: Re-send with payment
        const paymentHeaders =
          httpClient.encodePaymentSignatureHeader(paymentPayload);

        emit(4, "Re-sending with payment header", "success", {
          headersAdded: Object.keys(paymentHeaders),
        }, { method, url: endpoint, body });

        const res2 = await fetch(endpoint, {
          method,
          headers: { ...headers, ...paymentHeaders },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });

        // Step 5: Facilitator result
        if (res2.ok) {
          emit(5, "Facilitator verify + settle completed", "success", {
            status: res2.status,
            settledOn: "Stellar Testnet",
          });
        } else {
          const errText = await res2.text();
          emit(5, "Facilitator verify/settle failed", "error", {
            status: res2.status,
            error: errText.slice(0, 200),
          });
          setLoading(false);
          return;
        }

        // Step 6: Final response
        const data = await res2.json();
        emit(6, "200 OK — Response received", "success", { data });
      } catch (err) {
        emit(0, "Flow error", "error", {
          message: err instanceof Error ? err.message : String(err),
        });
      }

      setLoading(false);
    },
    [walletSigner]
  );

  return { steps, loading, runFlow };
}
