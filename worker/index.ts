/// <reference types="@cloudflare/workers-types" />

import { handleBindingStatus } from "./routes/binding-status";
import { handleFavorites } from "./routes/favorites";
import { handleCache } from "./routes/cache";
import { handleExport } from "./routes/export";
import { handleFlags } from "./routes/flags";
import { handlePageViews } from "./routes/pageviews";
import { handleEnvDebug } from "./routes/env-debug";

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
      if (path === "/api/binding-status") {
        return handleBindingStatus(request, env);
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
      if (path === "/api/flags") {
        return handleFlags(request, env);
      }
      if (path === "/api/pageviews") {
        return handlePageViews(request, env);
      }
      if (path === "/api/env-debug") {
        return handleEnvDebug(request, env);
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
