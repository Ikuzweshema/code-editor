import { defineConfig } from "vite";
import path from "node:path";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname + "./src"),
    },
  },
});
