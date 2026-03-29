"use client";

import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";

interface PaymentActionsProps {
  text: string;
  onTextChange: (text: string) => void;
  onJoke: () => void;
  onSummarize: () => void;
  disabled: boolean;
}

export function PaymentActions({
  text,
  onTextChange,
  onJoke,
  onSummarize,
  disabled,
}: PaymentActionsProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-3">
        <Button
          variant="primary"
          className="flex-1"
          onClick={onJoke}
          disabled={disabled}
        >
          Get Joke — $0.001 USDC
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onSummarize}
          disabled={disabled}
        >
          Summarize — $0.001 USDC
        </Button>
      </div>

      <Textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Text to summarize..."
        rows={3}
      />
    </div>
  );
}
