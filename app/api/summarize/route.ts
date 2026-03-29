import { withPayment } from "@/lib/x402/server";

export async function POST(req: Request) {
  const body = await req.json();

  return withPayment(
    req,
    () => {
      const { text } = body;
      if (!text) {
        return Response.json(
          { error: "Missing 'text' field in request body" },
          { status: 400 }
        );
      }

      const sentences = text
        .split(/[.!?]+/)
        .filter((s: string) => s.trim().length > 0);
      const summary =
        sentences.length <= 2
          ? text
          : sentences.slice(0, Math.ceil(sentences.length / 3)).join(". ") +
            ".";

      return Response.json({
        summary,
        originalLength: text.length,
        summaryLength: summary.length,
        paidWith: "USDC on Stellar (x402)",
      });
    },
    body
  );
}
