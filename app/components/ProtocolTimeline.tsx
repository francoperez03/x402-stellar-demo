"use client";

import { ProtocolStep } from "./ProtocolStep";
import { Card } from "./ui/Card";
import type { StepData } from "./ProtocolStep";

interface ProtocolTimelineProps {
  steps: StepData[];
  loading: boolean;
}

export function ProtocolTimeline({ steps, loading }: ProtocolTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <div>
      <h2 className="font-headline text-xl text-black mb-4">
        Protocol Flow
      </h2>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <ProtocolStep key={i} data={step} />
        ))}
      </div>

      {loading && (
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 h-4 w-px bg-gray-200" />
          <div className="absolute left-[7px] top-3 w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
          <Card variant="pending" className="p-3">
            <span className="text-sm text-gray-500">
              Waiting for wallet approval...
            </span>
          </Card>
        </div>
      )}
    </div>
  );
}
