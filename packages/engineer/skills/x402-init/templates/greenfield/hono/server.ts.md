# Hono Greenfield Server

Minimal Hono server with a single `/api/hello` endpoint.

```typescript
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.get("/api/hello", (c) => {
  return c.json({ message: "Hello from x402!" });
});

serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```
