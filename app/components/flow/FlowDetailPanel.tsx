"use client";

import type { FlowStepConfig, StepData } from "./flow-config";

function isImagePath(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /\.(gif|png|jpg|jpeg|webp)$/i.test(value);
}

function DetailSection({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown>;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
        {title}
      </p>
      <div className="space-y-0.5">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            {isImagePath(value) ? (
              <div className="mt-1">
                <img
                  src={value}
                  alt={key}
                  className="rounded max-w-[200px]"
                />
              </div>
            ) : (
              <div className="flex gap-2 text-[11px] font-mono">
                <span className="text-gray-400 shrink-0">{key}:</span>
                <span className="text-gray-700 break-all">
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface FlowDetailPanelProps {
  config: FlowStepConfig | null;
  stepData: StepData | null;
}

export function FlowDetailPanel({ config, stepData }: FlowDetailPanelProps) {
  if (!config || !stepData) {
    return (
      <div className="min-h-[120px] flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 mt-4">
        <p className="text-sm text-gray-400">Click a completed step to see details</p>
      </div>
    );
  }

  const hasRequest = !!stepData.request;
  const hasDetail = !!stepData.detail;

  return (
    <div className="min-h-[120px] rounded-lg border border-gray-200 bg-white p-4 mt-4">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs font-mono text-gray-400">Step {config.step}</span>
        <h4 className="text-sm font-medium text-black">{config.label}</h4>
      </div>
      <p className="text-xs text-gray-500 mb-3">{config.description}</p>

      <div className={`${hasRequest && hasDetail ? "grid grid-cols-2 gap-4" : ""}`}>
        {hasRequest && (
          <DetailSection
            title="Request"
            data={{
              method: stepData.request!.method,
              url: stepData.request!.url,
              ...(stepData.request!.body ? { body: stepData.request!.body } : {}),
            }}
          />
        )}
        {hasDetail && (
          <DetailSection title="Response" data={stepData.detail} />
        )}
      </div>
    </div>
  );
}
