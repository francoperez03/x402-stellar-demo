/** A single step in the x402 payment flow (emitted by useX402Payment). */
export interface StepData {
  step: number;
  label: string;
  status: "success" | "error" | "pending";
  detail: Record<string, unknown>;
  request?: { method: string; url: string; body?: unknown };
  timestamp: number;
  elapsed?: number;
}

/** The four actors in the x402 sequence diagram. */
export type Actor = "client" | "server" | "wallet" | "facilitator";

/** Configuration for a visual node in the protocol flow diagram. */
export interface FlowStepConfig {
  step: number;
  dataStep: number;
  label: string;
  shortLabel: string;
  description: string;
  actor: Actor;
  from: Actor;
  to: Actor;
}
