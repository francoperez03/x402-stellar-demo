import { withPayment } from "@/lib/x402/server";

export async function GET(req: Request) {
  return withPayment(req, () => {
    return Response.json({
      message: "Surprise! Doge!",
      gif: "/doge-dancing.gif",
      paidWith: "USDC on Stellar (x402)",
    });
  });
}
