"use client";

import ConfettiExplosion from "react-confetti-explosion";
import type { StepData } from "./flow/flow-config";

interface SecretRevealProps {
  steps: StepData[];
}

export function SecretReveal({ steps }: SecretRevealProps) {
  const finalStep = steps.find((s) => s.step === 6 && s.status === "success");
  if (!finalStep) return null;

  const gif = finalStep.detail?.data as Record<string, unknown> | undefined;
  const gifUrl = gif?.gif as string | undefined;

  return (
    <div className="flex flex-col items-center mt-8 relative">
      <ConfettiExplosion particleCount={80} width={1200} duration={3000} />
      <p className="font-headline text-2xl text-black mb-4">
        Surprise! Doge!
      </p>
      {gifUrl && (
        <img
          src={gifUrl}
          alt="Dancing Doge"
          className="rounded-xl max-w-xs border-4 border-[#D4A017]"
        />
      )}
    </div>
  );
}
