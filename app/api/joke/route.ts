import { withPayment } from "@/lib/x402/server";

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "Why do Java developers wear glasses? Because they can't C#.",
  "!false — it's funny because it's true.",
  "A blockchain developer walks into a bar. The bartender says: 'Sorry, we don't serve your type here.' The developer says: 'That's fine, I'll just fork this place.'",
];

export async function GET(req: Request) {
  return withPayment(req, () => {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return Response.json({ joke, paidWith: "USDC on Stellar (x402)" });
  });
}
