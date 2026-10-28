import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
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
        cloud: resolve("cloud-console.html"),
        admin: resolve("admin-cms.html"),
        analytics: resolve("analytics.html"),
      },
    },
  },
  test: { include: ["tests/**/*.test.ts"] },
});
