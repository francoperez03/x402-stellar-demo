import type { Actor } from "../../types/x402";
import { ACTOR_META } from "./flow-config";

interface ActorColumnProps {
  actor: Actor;
}

export function ActorColumn({ actor }: ActorColumnProps) {
  const meta = ACTOR_META[actor];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border ${meta.color}`}
      >
        {meta.letter}
      </div>
      <span className="text-[11px] font-medium text-gray-600">
        {meta.label}
      </span>
    </div>
  );
}
