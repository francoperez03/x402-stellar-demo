import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "./CopyButton";

export const metadata: Metadata = {
  title: "Install x402 Engineer | Claude Code Skill for x402 Micropayments",
  description:
    "Add x402 micropayments to any API in seconds. Install the x402-engineer skill for Claude Code: npx x402-engineer install. Supports Next.js, Express, Fastify, Hono.",
};

const commands = [
  {
    name: "/x402:init",
    description: "Bootstrap x402 payment config in your project",
  },
  {
    name: "/x402:add-paywall",
    description: "Protect any API endpoint with a paywall",
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
      "Run the command above. It copies x402 reference docs and slash commands into your Claude Code skills directory.",
  },
  {
    number: 2,
    title: "Initialize your project",
    description:
      "Use /x402:init to scaffold x402 config, wallet setup, and payment middleware for your framework.",
  },
  {
    number: 3,
    title: "Add paywalls",
    description:
      "Use /x402:add-paywall on any API route. The skill handles middleware wiring, USDC pricing, and Stellar settlement.",
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

        <div className="mt-8 mb-12">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Install
          </p>
          <h1 className="font-headline text-4xl text-black mb-3">
            Add x402 to your API
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            A Claude Code skill pack for the x402 protocol. One command to
            install, then use slash commands to add micropayments to any
            endpoint.
          </p>
        </div>

        {/* Install command block */}
        <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between mb-16">
          <pre className="font-mono text-sm text-gray-100 m-0">
            npx x402-engineer install
          </pre>
          <CopyButton text="npx x402-engineer install" />
        </div>

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
            Available Commands
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
            Recommended: /x402:init &rarr; /x402:add-paywall &rarr;
            /x402:explain &rarr; /x402:debug
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
