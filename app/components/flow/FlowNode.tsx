"use client";

import type { FlowStepConfig, StepData } from "./flow-config";

const actorColors = {
  client: "bg-blue-50 text-blue-600",
  server: "bg-gray-100 text-gray-600",
  wallet: "bg-amber-50 text-amber-700",
  facilitator: "bg-purple-50 text-purple-600",
} as const;

interface FlowNodeProps {
  config: FlowStepConfig;
  stepData: StepData | null;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function FlowNode({
  config,
  stepData,
  isActive,
  isSelected,
  onSelect,
}: FlowNodeProps) {
  const status = stepData?.status;
  const isCompleted = status === "success" || status === "error";
  const isError = status === "error";

  let nodeClasses = "border bg-gray-100 border-gray-300 text-gray-400";
  let animClass = "";

  if (isSelected && isCompleted) {
    nodeClasses =
      "border-2 border-[#D4A017] bg-white text-black ring-2 ring-[#D4A017]/20";
  } else if (isActive) {
    nodeClasses = "border bg-white border-[#D4A017] text-gray-700";
    animClass = "flow-node-active";
  } else if (isError) {
    nodeClasses =
      "border border-red-300 bg-red-50 text-red-700";
  } else if (isCompleted) {
    nodeClasses =
      "border border-green-300 bg-white text-black";
  }

  return (
    <div
      className={`w-28 shrink-0 rounded-lg px-3 py-2.5 transition-all duration-300 text-center ${nodeClasses} ${animClass} ${
        isCompleted ? "cursor-pointer" : ""
      }`}
      onClick={isCompleted ? onSelect : undefined}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span className="text-xs font-mono opacity-60">{config.step}</span>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${actorColors[config.actor]}`}
        >
          {config.actor}
        </span>
      </div>
      <p className="text-xs font-medium leading-tight">{config.shortLabel}</p>
      {stepData?.elapsed !== undefined && isCompleted && (
        <p className="text-[10px] font-mono text-gray-400 mt-1">
          {stepData.elapsed}ms
        </p>
      )}
    </div>
  );
}
