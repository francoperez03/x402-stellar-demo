"use client";

import { useEffect, useState } from "react";
import { FLOW_STEPS } from "./flow-config";
import { FlowNode } from "./FlowNode";
import { FlowConnector } from "./FlowConnector";
import { FlowDetailPanel } from "./FlowDetailPanel";
import type { StepData } from "./flow-config";

interface ProtocolFlowDiagramProps {
  steps: StepData[];
  loading: boolean;
}

export function ProtocolFlowDiagram({ steps, loading }: ProtocolFlowDiagramProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // Determine the active step (currently being processed)
  const lastCompletedStep = steps.length > 0 ? steps[steps.length - 1].step : 0;
  const activeStep = loading ? lastCompletedStep + 1 : null;

  // Check if any step errored
  const errorStep = steps.find((s) => s.status === "error");

  // Auto-select the latest completed step as flow progresses
  useEffect(() => {
    if (steps.length > 0) {
      const latest = steps[steps.length - 1];
      setSelectedStep(latest.step);
    } else {
      setSelectedStep(null);
    }
  }, [steps]);

  const selectedConfig = selectedStep
    ? FLOW_STEPS.find((c) => c.step === selectedStep) ?? null
    : null;
  const selectedData = selectedStep
    ? steps.find((s) => s.step === selectedStep) ?? null
    : null;

  return (
    <div className="bg-[#F5F0E8]/30 rounded-2xl p-4 border border-gray-200">
      <h3 className="font-headline text-lg text-black mb-4 text-center">Protocol Flow</h3>

      {/* Horizontal flow strip */}
      <div className="flex items-center justify-center overflow-x-auto py-2">
        {FLOW_STEPS.map((config, i) => {
          const stepData = steps.find((s) => s.step === config.step) ?? null;
          const isActive = activeStep === config.step;
          const effectiveActive = errorStep ? false : isActive;

          return (
            <div key={config.step} className="flex items-center">
              {i > 0 && (
                <FlowConnector
                  completed={
                    !!steps.find(
                      (s) =>
                        s.step === FLOW_STEPS[i - 1].step &&
                        s.status === "success"
                    )
                  }
                />
              )}
              <FlowNode
                config={config}
                stepData={stepData}
                isActive={effectiveActive}
                isSelected={selectedStep === config.step}
                onSelect={() => setSelectedStep(config.step)}
              />
            </div>
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
