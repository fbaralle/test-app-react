/// <reference types="@cloudflare/workers-types" />

import { handleHealthcheck } from "./routes/healthcheck";
import { handleFavorites } from "./routes/favorites";
import { handleCache } from "./routes/cache";
import { handleExport } from "./routes/export";

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  FLAGS: KVNamespace;
  WEBFLOW_CLOUD_MEDIA: R2Bucket;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // API routes
    if (path.startsWith("/api/")) {
      if (path === "/api/healthcheck") {
        return handleHealthcheck(request, env);
      }
      if (path === "/api/favorites") {
        return handleFavorites(request, env);
      }
      if (path === "/api/cache") {
        return handleCache(request, env);
      }
      if (path === "/api/export") {
        return handleExport(request, env);
      }
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Serve static assets for SPA
    return env.ASSETS.fetch(request);
  },
};
