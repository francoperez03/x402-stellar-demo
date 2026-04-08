"use client";

import { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white",
  secondary:
    "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed",
  accent:
    "bg-[#D4A017] hover:bg-[#B8901A] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-black font-semibold",
  ghost: "text-gray-400 hover:text-black bg-transparent",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
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
