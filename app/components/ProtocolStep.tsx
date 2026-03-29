"use client";

import { useState } from "react";
import { Card } from "./ui/Card";

export interface StepData {
  step: number;
  label: string;
  status: "success" | "error" | "pending";
  detail: Record<string, unknown>;
  timestamp: number;
  elapsed?: number;
}

const statusToVariant = {
  success: "success",
  error: "error",
  pending: "pending",
} as const;

const dotColors = {
  success: "bg-green-500",
  error: "bg-red-500",
  pending: "bg-gray-400 animate-pulse",
} as const;

const labelColors = {
  success: "text-green-700",
  error: "text-red-700",
  pending: "text-gray-500",
} as const;

export function ProtocolStep({ data }: { data: StepData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
      <div
        className={`absolute left-[7px] top-3 w-3 h-3 rounded-full ${dotColors[data.status]}`}
      />

      <Card
        variant={statusToVariant[data.status]}
        className="mb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400 w-6">
              #{data.step}
            </span>
            <span className={`text-sm font-medium ${labelColors[data.status]}`}>
              {data.label}
            </span>
          </div>
          {data.elapsed !== undefined && (
            <span className="text-xs font-mono text-gray-400">
              +{data.elapsed}ms
            </span>
          )}
        </div>

        {expanded && data.detail && (
          <pre className="mt-3 p-2 rounded bg-gray-50 text-xs text-gray-700 overflow-x-auto font-mono">
            {JSON.stringify(data.detail, null, 2)}
          </pre>
        )}
      </Card>
    </div>
  );
}
