import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error Too lazy
import path from "path";
// https://github.com/tailwindlabs/tailwindcss/issues/16751
// @ts-expect-error Tailwind and Vite are having some problems ATM
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  root: path.join(__dirname, "game"), // Point to your app directory
  build: {
    outDir: path.join(__dirname, "webroot"), // Specify your desired output directory
    emptyOutDir: true, // Clean the output directory before each build
    copyPublicDir: true, // Copies over assets
    sourcemap: true, // Enable sourcemaps
  },
});
