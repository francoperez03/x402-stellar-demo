import { ProtocolDemo } from "./components/ProtocolDemo";

export default function Home() {
  return (
    <>
      {/* Hero + Stats as one block */}
      <section className="bg-[#F5F0E8] px-8 md:px-16 lg:px-24 pt-20 pb-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          x402 Protocol Demo
        </p>
        <h1 className="font-headline text-5xl text-black mb-4 leading-tight">
          There&apos;s a secret behind this paywall
        </h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-lg mb-10">
          Pay{" "}
          <span className="font-medium text-black">$0.001 USDC</span> on
          Stellar testnet to reveal it. No API keys, no accounts — just
          cryptography and the x402 protocol.
        </p>

        {/* Stats integrated into hero */}
        <div className="grid grid-cols-3 max-w-lg border-t border-gray-300/60">
          <div className="py-5 pr-6">
            <p className="font-headline text-2xl text-black">$0.001</p>
            <p className="text-xs text-gray-500 mt-0.5">per request</p>
          </div>
          <div className="py-5 px-6 border-x border-gray-300/60">
            <p className="font-headline text-2xl text-black">&lt; 5s</p>
            <p className="text-xs text-gray-500 mt-0.5">settlement</p>
          </div>
          <div className="py-5 pl-6">
            <p className="font-headline text-2xl text-black">Testnet</p>
            <p className="text-xs text-gray-500 mt-0.5">Stellar + OZ</p>
          </div>
        </div>
      </section>

      {/* Demo */}
      <main className="px-8 md:px-16 lg:px-24 py-10">
        <ProtocolDemo />
      </main>
    </>
  );
}
