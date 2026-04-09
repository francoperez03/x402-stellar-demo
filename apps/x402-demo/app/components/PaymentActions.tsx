"use client";

import { Button } from "./ui/Button";

interface PaymentActionsProps {
  onReveal: () => void;
  disabled: boolean;
}

export function PaymentActions({ onReveal, disabled }: PaymentActionsProps) {
  return (
    <div className="mb-8">
      <Button variant="accent" onClick={onReveal} disabled={disabled}>
        Pay $0.001 — Get the data
      </Button>
    </div>
  );
}
