"use client";

import { useState } from "react";

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

export function InstallSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npx x402-engineer install");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text if clipboard API unavailable
    }
  };

  return (
    <section className="bg-[#F5F0E8] px-8 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Get Started
        </p>
        <h2 className="font-headline text-4xl text-black mb-3">
          Add x402 to your API
        </h2>
        <p className="text-gray-600 text-base leading-relaxed max-w-lg mx-auto mb-10">
          A Claude Code skill pack for x402. One command to install, then use
          slash commands to add micropayments to any endpoint.
        </p>

        {/* Install command block */}
        <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between">
          <code className="font-mono text-sm text-gray-100">
            npx x402-engineer install
          </code>
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-white transition-colors ml-4 flex-shrink-0"
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            {copied ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Slash commands */}
        <h3 className="font-medium text-lg text-black mt-10 mb-4">
          Available Commands
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
          {commands.map((cmd) => (
            <div
              key={cmd.name}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <p className="font-mono font-bold text-sm text-black">
                {cmd.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">{cmd.description}</p>
            </div>
          ))}
        </div>

        {/* Supported frameworks */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">Works with</p>
          <div className="flex items-center justify-center gap-4">
            {frameworks.map((fw, i) => (
              <span key={fw} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">{fw}</span>
                {i < frameworks.length - 1 && (
                  <span className="text-gray-300" aria-hidden="true">
                    &middot;
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended workflow */}
        <p className="text-xs text-gray-400 mt-6 text-center font-mono">
          /x402:init &rarr; /x402:add-paywall &rarr; /x402:explain &rarr;
          /x402:debug
        </p>
      </div>
    </section>
  );
}
