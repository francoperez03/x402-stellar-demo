export interface StepData {
  step: number;
  label: string;
  status: "success" | "error" | "pending";
  detail: Record<string, unknown>;
  request?: { method: string; url: string; body?: unknown };
  timestamp: number;
  elapsed?: number;
}

export interface FlowStepConfig {
  step: number;
  label: string;
  shortLabel: string;
  description: string;
  actor: "client" | "server" | "wallet" | "facilitator";
}

export const FLOW_STEPS: FlowStepConfig[] = [
  { step: 1, label: "Request sent (no payment)", shortLabel: "Request", description: "Client sends initial HTTP request without payment", actor: "client" },
  { step: 2, label: "402 Payment Required", shortLabel: "402 Received", description: "Server responds 402 with payment requirements", actor: "server" },
  { step: 3, label: "Signing with wallet", shortLabel: "Sign", description: "Wallet signs the payment authorization", actor: "wallet" },
  { step: 4, label: "Re-send with payment", shortLabel: "Pay & Send", description: "Client re-sends request with payment header", actor: "client" },
  { step: 5, label: "Verify + settle", shortLabel: "Settle", description: "Facilitator verifies and settles on-chain", actor: "facilitator" },
  { step: 6, label: "200 OK — Response", shortLabel: "200 OK", description: "Server returns the protected resource", actor: "server" },
];
