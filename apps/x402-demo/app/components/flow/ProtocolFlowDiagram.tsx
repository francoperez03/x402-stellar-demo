"use client";

import { useEffect, useState } from "react";
import { ACTORS, FLOW_STEPS } from "./flow-config";
import { ActorColumn } from "./ActorColumn";
import { SequenceRow } from "./SequenceRow";
import { FlowDetailPanel } from "./FlowDetailPanel";
import type { StepData } from "@x402/engineer";

interface ProtocolFlowDiagramProps {
  steps: StepData[];
  loading: boolean;
}

export function ProtocolFlowDiagram({ steps, loading }: ProtocolFlowDiagramProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // Determine the active data step (currently being processed by the hook)
  const lastCompletedDataStep = steps.length > 0 ? steps[steps.length - 1].step : 0;
  const activeDataStep = loading ? lastCompletedDataStep + 1 : null;

  // Check if any step errored
  const errorStep = steps.find((s) => s.status === "error");

  // Auto-select the latest visual step that maps to the latest completed data step
  useEffect(() => {
    if (steps.length > 0) {
      const latestDataStep = steps[steps.length - 1].step;
      // Find the last visual row matching this data step
      const matchingRows = FLOW_STEPS.filter((c) => c.dataStep === latestDataStep);
      const lastMatch = matchingRows[matchingRows.length - 1];
      if (lastMatch) setSelectedStep(lastMatch.step);
    } else {
      setSelectedStep(null);
    }
  }, [steps]);

  const selectedConfig = selectedStep
    ? FLOW_STEPS.find((c) => c.step === selectedStep) ?? null
    : null;
  const selectedData = selectedConfig
    ? steps.find((s) => s.step === selectedConfig.dataStep) ?? null
    : null;

  return (
    <div className="bg-[#F5F0E8]/30 rounded-2xl p-4 border border-gray-200">
      <h3 className="font-headline text-lg text-black mb-4 text-center">Protocol Flow</h3>

      <div className="min-w-[480px] overflow-x-auto">
        {/* Actor headers */}
        <div className="grid grid-cols-4 gap-0 mb-1">
          {ACTORS.map((actor) => (
            <div key={actor} className="flex justify-center">
              <ActorColumn actor={actor} />
            </div>
          ))}
        </div>

        {/* Sequence rows */}
        {FLOW_STEPS.map((config, i) => {
          const stepData = steps.find((s) => s.step === config.dataStep) ?? null;
          const isActive = activeDataStep === config.dataStep;
          const effectiveActive = errorStep ? false : isActive;

          return (
            <SequenceRow
              key={config.step}
              config={config}
              stepData={stepData}
              isActive={effectiveActive}
              isSelected={selectedStep === config.step}
              onSelect={() => setSelectedStep(config.step)}
              isLast={i === FLOW_STEPS.length - 1}
            />
          );
        })}
      </div>

      {/* Detail panel below */}
      <FlowDetailPanel config={selectedConfig} stepData={selectedData} />

      {/* Error banner */}
      {errorStep && (
        <div className="mt-3 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
          Flow stopped at step {errorStep.step}: {errorStep.label}
        </div>
      )}
    </div>
  );
}
