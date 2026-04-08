# Express Greenfield Server

Minimal Express server with a single `/api/hello` endpoint.

```typescript
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from x402!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```
