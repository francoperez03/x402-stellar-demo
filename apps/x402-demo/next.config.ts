import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@stellar/stellar-sdk", "@x402/stellar"],
  transpilePackages: ["@x402/engineer"],
};

export default nextConfig;
