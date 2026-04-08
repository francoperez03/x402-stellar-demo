const colors = {
  green: "bg-green-500",
  red: "bg-red-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  zinc: "bg-zinc-500",
} as const;

interface StatusDotProps {
  color: keyof typeof colors;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ color, pulse = false, className = "" }: StatusDotProps) {
  return (
    <span
      className={`w-2 h-2 rounded-full inline-block ${colors[color]} ${pulse ? "animate-pulse" : ""} ${className}`}
    />
  );
}
