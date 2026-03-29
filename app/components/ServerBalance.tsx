"use client";

import { useCallback, useEffect, useState } from "react";

interface ServerInfo {
  address: string;
  balance: string | null;
}

interface ServerBalanceProps {
  refetchKey: number;
}

export function ServerBalance({ refetchKey }: ServerBalanceProps) {
  const [info, setInfo] = useState<ServerInfo | null>(null);

  const fetchInfo = useCallback(async () => {
    try {
      const res = await fetch("/api/server-info");
      if (res.ok) {
        setInfo(await res.json());
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo, refetchKey]);

  if (!info) return null;

  return (
    <div className="mb-6 w-full max-w-md rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
        Server (receives payments)
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-600 truncate">
          {info.address}
        </span>
      </div>
      {info.balance !== null && (
        <p className="text-sm font-medium text-black mt-1">
          {parseFloat(info.balance).toFixed(4)} USDC
        </p>
      )}
    </div>
  );
}
