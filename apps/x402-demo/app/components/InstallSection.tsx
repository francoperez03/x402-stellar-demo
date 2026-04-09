"use client";

import { useState } from "react";
import Link from "next/link";

export function InstallSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("https://x402-stellar-demo.vercel.app/install");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text if clipboard API unavailable
    }
  };

  return (
    <section className="bg-[#F5F0E8] px-8 py-16 text-center">
      <div className="max-w-2xl mx-auto">
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
        <h2 className="font-headline text-3xl text-black mb-3">
          x402 Engineer
        </h2>
        <p className="text-gray-600 text-base leading-relaxed max-w-lg mx-auto mb-3">
          A skill pack that teaches Claude Code how to add x402 micropayments to
          any API endpoint. Install this Claude Code skill by running:{" "}
          <code className="text-sm font-mono text-black bg-black/5 px-1.5 py-0.5 rounded">
            npx @x402/engineer install
          </code>
        </p>

        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Or paste this URL in Claude Code
        </p>
        {/* Install URL block */}
        <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between">
          <code className="font-mono text-sm text-gray-100">
            https://x402-stellar-demo.vercel.app/install
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

        {/* Link to full install guide */}
        <div className="mt-4">
          <Link
            href="/install"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Full guide: commands, frameworks & workflow &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
