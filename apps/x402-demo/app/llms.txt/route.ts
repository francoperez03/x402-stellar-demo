import { NextResponse } from "next/server";

const LLMS_TXT = `# x402 Engineer — Claude Code Skill

> A skill pack that teaches Claude Code how to add x402 micropayments to any API endpoint on Stellar.

## Install

npx x402-engineer install

Or paste this URL in Claude Code: https://x402-stellar-demo.vercel.app/install

## Commands

- /x402:init — Bootstrap payment configuration
- /x402:add-paywall — Protect endpoints with paywalls
- /x402:debug — Diagnose configuration issues
- /x402:explain — Display project wiring details

## Frameworks

Next.js, Express, Fastify, Hono

## Learn more

- Install guide: https://x402-stellar-demo.vercel.app/install
- Demo: https://x402-stellar-demo.vercel.app
`;

export async function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
