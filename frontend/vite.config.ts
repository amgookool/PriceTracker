import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  build: {
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${process.env.PORT || 2500}`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias:{
      "@": path.resolve(import.meta.dir, "./src"),
      "@server": path.resolve(import.meta.dir, "../server"),
      "@types": path.resolve(import.meta.dir, "../types"),
    }
  }
});
