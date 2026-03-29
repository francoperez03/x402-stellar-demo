import { ProtocolDemo } from "./components/ProtocolDemo";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F5F0E8] px-8 md:px-16 lg:px-24 py-20">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          x402 Protocol Demo
        </p>
        <h1 className="font-headline text-5xl text-black mb-4 leading-tight">
          Pay-per-request on Stellar
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
          Micropayments using HTTP 402. Each API call costs{" "}
          <span className="font-medium text-black">$0.001 USDC</span> on
          Stellar testnet. No API keys, no accounts — just cryptography.
        </p>
      </section>

      {/* Stats bar */}
      <section className="bg-[#1A1A1A] px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-3 divide-x divide-gray-700 max-w-2xl">
          <div className="py-6 pr-6">
            <p className="font-headline text-3xl text-white">$0.001</p>
            <p className="text-sm text-gray-400 mt-1">per request (USDC)</p>
          </div>
          <div className="py-6 px-6">
            <p className="font-headline text-3xl text-white">&lt; 5s</p>
            <p className="text-sm text-gray-400 mt-1">settlement time</p>
          </div>
          <div className="py-6 pl-6">
            <p className="font-headline text-3xl text-white">Testnet</p>
            <p className="text-sm text-gray-400 mt-1">
              Stellar + OZ Facilitator
            </p>
          </div>
        </div>
      </section>

      {/* Demo */}
      <main className="px-8 md:px-16 lg:px-24 py-16">
        <ProtocolDemo />
      </main>
    </>
  );
}
