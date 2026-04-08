# Hono Greenfield package.json

Minimal package.json for a new Hono + TypeScript project.

```json
{
  "name": "x402-server",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@hono/node-server": "latest",
    "hono": "latest"
  },
  "devDependencies": {
    "tsx": "latest",
    "typescript": "latest"
  }
}
```
