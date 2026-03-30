import type { Actor, FlowStepConfig } from "../../types/x402";

export const ACTORS: readonly Actor[] = ["wallet", "client", "server", "facilitator"];

export const ACTOR_META: Record<Actor, { label: string; letter: string; color: string }> = {
  client:      { label: "Client",      letter: "C", color: "bg-blue-100 text-blue-700 border-blue-200" },
  server:      { label: "Server",      letter: "S", color: "bg-gray-100 text-gray-700 border-gray-200" },
  wallet:      { label: "Wallet",      letter: "W", color: "bg-amber-100 text-amber-700 border-amber-200" },
  facilitator: { label: "Facilitator", letter: "F", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

export const FLOW_STEPS: FlowStepConfig[] = [
  { step: 1, dataStep: 1, label: "Request sent (no payment)", shortLabel: "Request",      description: "Client sends initial HTTP request without payment",   actor: "client",      from: "client",      to: "server" },
  { step: 2, dataStep: 2, label: "402 Payment Required",      shortLabel: "402 Received", description: "Server responds 402 with payment requirements",       actor: "server",      from: "server",      to: "client" },
  { step: 3, dataStep: 3, label: "Signing with wallet",        shortLabel: "Sign",         description: "Wallet signs the payment authorization",              actor: "wallet",      from: "client",      to: "wallet" },
  { step: 4, dataStep: 4, label: "Re-send with payment",       shortLabel: "Pay & Send",   description: "Client re-sends request with payment header",         actor: "client",      from: "client",      to: "server" },
  { step: 5, dataStep: 5, label: "Verify payment",             shortLabel: "Verify",       description: "Server forwards payment to facilitator for verification", actor: "facilitator", from: "server",      to: "facilitator" },
  { step: 6, dataStep: 5, label: "Settlement confirmed",       shortLabel: "Settled",      description: "Facilitator settles on-chain and confirms to server", actor: "facilitator", from: "facilitator", to: "server" },
  { step: 7, dataStep: 6, label: "200 OK — Response",          shortLabel: "200 OK",       description: "Server returns the protected resource",               actor: "server",      from: "server",      to: "client" },
];
