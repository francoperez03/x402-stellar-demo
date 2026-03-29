import { SERVER_ADDRESS } from "@/lib/x402/config";

const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";

export async function GET() {
  try {
    const res = await fetch(`${HORIZON_TESTNET}/accounts/${SERVER_ADDRESS}`, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return Response.json({ address: SERVER_ADDRESS, balance: null });
    }

    const account = await res.json();
    const usdc = account.balances?.find(
      (b: { asset_code?: string }) => b.asset_code === "USDC"
    );

    return Response.json({
      address: SERVER_ADDRESS,
      balance: usdc ? usdc.balance : "0",
    });
  } catch {
    return Response.json({ address: SERVER_ADDRESS, balance: null });
  }
}
