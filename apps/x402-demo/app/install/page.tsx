import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "./CopyButton";

export const metadata: Metadata = {
  title: "Install x402 Skill | Claude Code Skill for Stellar Micropayments",
  description:
    "Claude Code skill for adding x402 micropayments to any API. Install: npx x402-engineer install. Slash commands for Next.js, Express, Fastify, Hono.",
};

const commands = [
  {
    name: "/x402:init",
    description: "Bootstrap x402 payment config in your project",
  },
  {
    name: "/x402:add-paywall",
    description: "Make any API endpoint charge per request",
  },
  {
    name: "/x402:debug",
    description: "Diagnose x402 configuration issues",
  },
  {
    name: "/x402:explain",
    description: "See how x402 is wired in your project",
  },
];

const frameworks = ["Next.js", "Express", "Fastify", "Hono"];

const steps = [
  {
    number: 1,
    title: "Install the skill",
    description:
      "Run the command below. It copies x402 reference docs and slash commands into your Claude Code skills directory (~/.claude/skills/).",
  },
  {
    number: 2,
    title: "Initialize your project",
    description:
      "Use /x402:init in Claude Code to scaffold x402 config, wallet setup, and payment middleware for your framework.",
  },
  {
    number: 3,
    title: "Protect your endpoints",
    description:
      "Use /x402:add-paywall to make any API route charge per request. The skill handles middleware, USDC pricing, and Stellar settlement.",
  },
];

export default function InstallPage() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen px-8 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header area */}
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          &larr; Back to demo
        </Link>

        <div className="mt-8 mb-10">
          <div className="inline-flex items-center gap-2 bg-[#D4A017]/15 text-[#8B6914] text-xs font-medium px-3 py-1 rounded-full mb-4">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Claude Code Skill
          </div>
          <h1 className="font-headline text-4xl text-black mb-3">
            x402 Engineer
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            A skill pack that teaches Claude Code how to add x402 micropayments
            to any API. Install once, then use slash commands to wire up
            pay-per-request endpoints on Stellar.
          </p>
        </div>

        {/* Install command block */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Paste this URL in Claude Code
          </p>
          <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between">
            <pre className="font-mono text-sm text-gray-100 m-0">
              https://x402-stellar-demo.vercel.app/install
            </pre>
            <CopyButton text="https://x402-stellar-demo.vercel.app/install" />
          </div>
        </div>

        {/* Alternative: npx */}
        <p className="text-xs text-gray-400 mb-16">
          Or run directly:{" "}
          <code className="font-mono text-gray-500">
            npx x402-engineer install
          </code>
        </p>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="font-headline text-2xl text-black mb-6">
            How it works
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-lg border border-gray-200 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1A1A1A] text-white text-sm font-medium flex items-center justify-center">
                    {step.number}
                  </span>
                  <div>
                    <p className="font-medium text-black">{step.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slash commands */}
        <div className="mb-16">
          <h2 className="font-headline text-2xl text-black mb-6">
            Slash Commands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commands.map((cmd) => (
              <div
                key={cmd.name}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <p className="font-mono font-bold text-sm text-black">
                  {cmd.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {cmd.description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center font-mono">
            /x402:init &rarr; /x402:add-paywall &rarr; /x402:explain &rarr;
            /x402:debug
          </p>
        </div>

        {/* Supported frameworks */}
        <div className="mb-16 text-center">
          <p className="text-sm text-gray-500 mb-3">Works with</p>
          <div className="flex items-center justify-center gap-4">
            {frameworks.map((fw, i) => (
              <span key={fw} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {fw}
                </span>
                {i < frameworks.length - 1 && (
                  <span className="text-gray-300" aria-hidden="true">
                    &middot;
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Footer-level CTA */}
        <div className="text-center pt-8 border-t border-gray-300/60">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            See it in action &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
