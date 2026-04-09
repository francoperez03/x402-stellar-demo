"use client";

import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import type { StepData } from "@x402/engineer";

interface SecretRevealProps {
  steps: StepData[];
}

export function SecretReveal({ steps }: SecretRevealProps) {
  const [dismissed, setDismissed] = useState(false);

  const finalStep = steps.find((s) => s.step === 6 && s.status === "success");

  // Reset dismissed when a new flow starts (steps emptied then refilled)
  useEffect(() => {
    if (steps.length === 0) setDismissed(false);
  }, [steps.length]);

  if (!finalStep || dismissed) return null;

  const gif = finalStep.detail?.data as Record<string, unknown> | undefined;
  const gifUrl = gif?.gif as string | undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setDismissed(true)}
    >
      <div
        className="relative bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">
          <ConfettiExplosion particleCount={100} width={1400} duration={3500} />
        </div>

        <p className="font-headline text-3xl text-black mb-4">
          That&apos;s x402.
        </p>

        {gifUrl && (
          <img
            src={gifUrl}
            alt="Dancing Doge"
            className="rounded-xl border-4 border-[#D4A017] mx-auto mb-4"
          />
        )}

        <p className="text-sm text-gray-500 mb-1">
          Paid with USDC on Stellar via x402
        </p>
        <p className="text-xs text-gray-400 mb-4">
          $0.001. No API key. No account. Just pay and get.
        </p>

        <button
          onClick={() => setDismissed(true)}
          className="w-full py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Nice
        </button>
      </div>
    </div>
  );
}
