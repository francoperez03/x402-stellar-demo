import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402 Stellar Micropayments",
  description:
    "Pay-per-request API demo using x402 protocol with USDC on Stellar",
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
