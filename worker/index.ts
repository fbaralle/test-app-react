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
    // Webflow Cloud mounts the app at a path prefix (e.g. /vite-react-cf),
    // so the pathname we see is /<prefix>/api/... rather than /api/...
    // Match on the substring from /api/ onward so routing works regardless
    // of where the app is mounted.
    const apiIndex = url.pathname.indexOf("/api/");
    const path = apiIndex !== -1 ? url.pathname.slice(apiIndex) : url.pathname;

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
