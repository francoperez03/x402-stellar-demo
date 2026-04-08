import type { HTTPAdapter } from "@x402/core/server";

/**
 * Adapts a Web API Request to the HTTPAdapter interface expected by
 * x402HTTPResourceServer. Replaces ExpressAdapter for Next.js Route Handlers.
 */
export class NextRequestAdapter implements HTTPAdapter {
  private url: URL;

  constructor(
    private req: Request,
    private parsedBody?: unknown
  ) {
    this.url = new URL(req.url);
  }

  getHeader(name: string): string | undefined {
    return this.req.headers.get(name) ?? undefined;
  }

  getMethod(): string {
    return this.req.method;
  }

  getPath(): string {
    return this.url.pathname;
  }

  getUrl(): string {
    return this.req.url;
  }

  getAcceptHeader(): string {
    return this.req.headers.get("accept") ?? "";
  }

  getUserAgent(): string {
    return this.req.headers.get("user-agent") ?? "";
  }

  getQueryParams(): Record<string, string | string[]> {
    const params: Record<string, string | string[]> = {};
    this.url.searchParams.forEach((value, key) => {
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
    const values = this.url.searchParams.getAll(name);
    if (values.length === 0) return undefined;
    if (values.length === 1) return values[0];
    return values;
  }

  getBody(): unknown {
    return this.parsedBody;
  }
}
