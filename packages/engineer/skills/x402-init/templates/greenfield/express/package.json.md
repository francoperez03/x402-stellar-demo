# Express Greenfield package.json

Minimal package.json for a new Express + TypeScript project.

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
    "express": "latest"
  },
  "devDependencies": {
    "@types/express": "latest",
    "tsx": "latest",
    "typescript": "latest"
  }
}
```
