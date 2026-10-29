import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
export default defineConfig({
  server: {
    allowedHosts: ["terminal.local"],
    watch: { ignored: ["**/.generated/**"] },
  },
  optimizeDeps: {
    entries: [
      "index.html",
      "workspace.html",
      "cloud-console.html",
      "admin-cms.html",
      "analytics.html",
    ],
  },
  preview: { allowedHosts: ["terminal.local"] },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@hub/screen-patterns": resolve("packages/screen-patterns/src/index.tsx"),
      "@hub/ui-core": resolve("packages/ui-core/src/index.tsx"),
      "@hub/patterns": resolve("packages/patterns/src/index.ts"),
      "@hub/project-generator": resolve(
        "packages/project-generator/src/index.ts",
      ),
    },
  },
  build: {
    rollupOptions: {
      input: {
        showcase: resolve("index.html"),
        workspace: resolve("workspace.html"),
        cloud: resolve("cloud-console.html"),
        admin: resolve("admin-cms.html"),
        analytics: resolve("analytics.html"),
      },
    },
  },
  test: { include: ["tests/**/*.test.ts"] },
});
