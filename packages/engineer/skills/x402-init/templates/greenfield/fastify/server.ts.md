# Fastify Greenfield Server

Minimal Fastify server with a single `/api/hello` endpoint.

```typescript
import Fastify from "fastify";

const fastify = Fastify();
const port = Number(process.env.PORT) || 3000;

fastify.get("/api/hello", async () => {
  return { message: "Hello from x402!" };
});

fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${port}`);
});
```
