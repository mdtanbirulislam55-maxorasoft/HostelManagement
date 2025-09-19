import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
/*
 * Vite configuration for the HostelFlow project.
 *
 * The original project used Replit-specific plugins such as
 * `@replit/vite-plugin-runtime-error-modal` and
 * `@replit/vite-plugin-cartographer` to provide a runtime error overlay and
 * cartographer integrations when running on the Replit platform. These
 * dependencies are not available outside of Replit and will cause the build
 * to fail. To ensure the project runs locally without pulling in unsupported
 * dependencies, the imports and plugin entries for these packages have been
 * removed. Should you need similar functionality in your local environment,
 * consider adding a generic error overlay plugin or another development tool
 * that provides hot reloading or error handling.
 */

export default defineConfig({
  // Only include the React plugin. Additional plugins can be added here
  // as needed, but avoid Replit-specific plugins in a local environment.
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
