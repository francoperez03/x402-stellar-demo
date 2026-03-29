"use client";

import { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white",
  secondary:
    "border border-black text-black hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400",
  accent:
    "bg-[#D4A017] hover:bg-[#B8901A] disabled:bg-gray-200 disabled:text-gray-400 text-black",
  ghost: "text-gray-500 hover:text-black bg-transparent",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-3 text-sm",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} rounded-lg font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
