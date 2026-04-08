"use client";

import { Button } from "./ui/Button";
import { StatusDot } from "./ui/StatusDot";

interface WalletBarProps {
  address: string | null;
  balance: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletBar({ address, balance, onConnect, onDisconnect }: WalletBarProps) {
  if (!address) {
    return (
      <div className="mb-6">
        <Button variant="accent" onClick={onConnect}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center gap-3">
      <StatusDot color="green" />
      <span className="text-sm text-gray-700 font-mono">
        {address.slice(0, 6)}...{address.slice(-6)}
      </span>
      {balance !== null && (
        <span className="text-sm font-medium text-black">
          {parseFloat(balance).toFixed(4)} USDC
        </span>
      )}
      <Button variant="ghost" size="sm" onClick={onDisconnect}>
        Disconnect
      </Button>
    </div>
  );
}
