const variants = {
  default: "border border-gray-200 bg-white",
  success: "border border-gray-200 border-l-4 border-l-green-500 bg-white",
  error: "border border-gray-200 border-l-4 border-l-red-500 bg-white",
  pending: "border border-gray-200 bg-gray-50 animate-pulse",
  dark: "bg-[#1A1A1A] border-[#2A2A2A] text-white",
} as const;

interface CardProps {
  variant?: keyof typeof variants;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  className = "",
  onClick,
  children,
}: CardProps) {
  return (
    <div
      className={`border rounded-lg p-3 ${variants[variant]} ${onClick ? "cursor-pointer" : ""} transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
