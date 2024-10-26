// vite.config.js
import { defineConfig } from "vite";
import path from "path";

const dt = new Date();
const version = `"${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}-${dt.getHours()}-${dt.getMinutes()}-${dt.getSeconds()}"`;

const fullReloadAlways = {
  name: "full-reload-always",
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" });
    return [];
  },
};

export default defineConfig({
  base: "/gameplay/",
  build: {
    sourcemap: true,
    minify: false,
    target: "esnext",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: "./index.html",
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  define: {
    APP_VERSION: version,
  },
  plugins: [fullReloadAlways],
});
