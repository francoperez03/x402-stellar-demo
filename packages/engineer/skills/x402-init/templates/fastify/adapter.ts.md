# Fastify HTTPAdapter Template

Custom adapter implementing `HTTPAdapter` from `@x402/core/server`.
Required because `@x402/fastify` is not published on npm.

```typescript
import type { HTTPAdapter } from "@x402/core/server";
import type { FastifyRequest } from "fastify";

export class FastifyAdapter implements HTTPAdapter {
  constructor(private req: FastifyRequest) {}

  getHeader(name: string): string | undefined {
    const value = this.req.headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] : value ?? undefined;
  }

  getMethod(): string {
    return this.req.method;
  }

  getPath(): string {
    return this.req.url.split("?")[0];
  }

  getUrl(): string {
    return `${this.req.protocol}://${this.req.hostname}${this.req.url}`;
  }

  getAcceptHeader(): string {
    return this.req.headers.accept ?? "";
  }

  getUserAgent(): string {
    return this.req.headers["user-agent"] ?? "";
  }

  getQueryParams(): Record<string, string | string[]> {
    const url = new URL(this.getUrl());
    const params: Record<string, string | string[]> = {};
    url.searchParams.forEach((value, key) => {
      const existing = params[key];
      if (existing) {
        params[key] = Array.isArray(existing)
          ? [...existing, value]
          : [existing, value];
      } else {
        params[key] = value;
      }
    });
    return params;
  }

  getQueryParam(name: string): string | string[] | undefined {
    const url = new URL(this.getUrl());
    const values = url.searchParams.getAll(name);
    if (values.length === 0) return undefined;
    if (values.length === 1) return values[0];
    return values;
  }

  getBody(): unknown {
    return this.req.body;
  }
}
```
