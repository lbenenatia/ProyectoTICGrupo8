import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: 5173,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [
      "wally-unappealed-magdalen.ngrok-free.dev",
      ".ngrok-free.dev",
      ".ngrok.app",
      ".amazonaws.com",
      ".builtwithrocket.new",
    ],
    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 4028,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
