"use client";

import type { FlowStepConfig, StepData } from "@x402/engineer";
import { ACTORS } from "./flow-config";

interface SequenceRowProps {
  config: FlowStepConfig;
  stepData: StepData | null;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
}

export function SequenceRow({
  config,
  stepData,
  isActive,
  isSelected,
  onSelect,
  isLast,
}: SequenceRowProps) {
  const status = stepData?.status;
  const isCompleted = status === "success" || status === "error";
  const isError = status === "error";

  const fromIdx = ACTORS.indexOf(config.from);
  const toIdx = ACTORS.indexOf(config.to);
  const leftIdx = Math.min(fromIdx, toIdx);
  const rightIdx = Math.max(fromIdx, toIdx);
  const goesRight = fromIdx < toIdx;

  // Arrow color based on state
  let arrowColor = "bg-gray-200";
  let labelClasses = "bg-gray-100 text-gray-400 border-gray-200";
  let arrowAnimClass = "";

  if (isSelected && isCompleted) {
    arrowColor = "bg-black";
    labelClasses = "bg-black text-white border-black shadow-sm";
  } else if (isActive) {
    arrowColor = "bg-[#D4A017]";
    labelClasses = "bg-white text-gray-700 border-[#D4A017]";
    arrowAnimClass = "flow-node-active";
  } else if (isError) {
    arrowColor = "bg-red-400";
    labelClasses = "bg-red-50 text-red-700 border-red-300";
  } else if (isCompleted) {
    arrowColor = "bg-green-400";
    labelClasses = "bg-white text-black border-green-300";
    arrowAnimClass = "flow-arrow-animate";
  }

  // Arrowhead color
  const arrowHeadBorder = isSelected && isCompleted
    ? "border-black"
    : isActive
      ? "border-[#D4A017]"
      : isError
        ? "border-red-400"
        : isCompleted
          ? "border-green-400"
          : "border-gray-200";

  return (
    <div
      className={`relative grid grid-cols-4 ${isCompleted ? "cursor-pointer" : ""}`}
      onClick={isCompleted ? onSelect : undefined}
    >
      {/* Lifeline segments — continuous lines, no dots */}
      {ACTORS.map((actor, i) => {
        const isInvolved = i === fromIdx || i === toIdx;
        const lifelineColor = stepData ? "bg-gray-300" : "bg-gray-200";
        return (
          <div key={actor} className="flex flex-col items-center">
            <div className={`w-[2px] min-h-[36px] ${lifelineColor} ${isInvolved ? "" : "opacity-40"}`} />
          </div>
        );
      })}

      {/* Arrow line + label overlay */}
      <div
        className="absolute left-0 right-0 flex items-center pointer-events-none"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div
          className="absolute flex items-center"
          style={{
            left: `${leftIdx * 25 + 12.5}%`,
            width: `${(rightIdx - leftIdx) * 25}%`,
          }}
        >
          {/* Arrow line */}
          <div className={`absolute inset-x-0 h-[2px] ${arrowColor} transition-colors duration-300 ${arrowAnimClass}`} />

          {/* Arrowhead at the "to" end */}
          <div
            className={`absolute ${goesRight ? "right-0" : "left-0"}`}
          >
            <div
              className={`w-0 h-0 ${
                goesRight
                  ? `border-l-[6px] ${arrowHeadBorder} border-y-[4px] border-y-transparent border-r-0`
                  : `border-r-[6px] ${arrowHeadBorder} border-y-[4px] border-y-transparent border-l-0`
              }`}
              style={goesRight ? { borderLeftStyle: "solid" } : { borderRightStyle: "solid" }}
            />
          </div>

          {/* Label pill centered on arrow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap transition-all duration-300 ${labelClasses}`}
            >
              {config.shortLabel}
              {stepData?.elapsed !== undefined && isCompleted && (
                <span className="ml-1 font-mono text-[9px] opacity-60">
                  {stepData.elapsed}ms
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
