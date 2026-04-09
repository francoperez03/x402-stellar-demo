import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402 Stellar Micropayments",
  description:
    "x402 Engineer — Claude Code skill for adding micropayments to any API. Install: npx x402-engineer install. Pay-per-request with USDC on Stellar.",
  other: {
    "agent:install": "npx x402-engineer install",
    "agent:type": "claude-code-skill",
    "agent:name": "x402 Engineer",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans min-h-screen">{children}</body>
    </html>
  );
}
