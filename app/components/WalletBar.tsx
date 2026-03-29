"use client";

import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { StatusDot } from "./ui/StatusDot";

interface WalletBarProps {
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletBar({ address, onConnect, onDisconnect }: WalletBarProps) {
  if (!address) {
    return (
      <Card className="mb-6 p-4">
        <Button variant="accent" fullWidth onClick={onConnect}>
          Connect Wallet
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mb-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusDot color="green" />
          <span className="text-sm text-gray-700 font-mono">
            {address.slice(0, 6)}...{address.slice(-6)}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
    </Card>
  );
}
