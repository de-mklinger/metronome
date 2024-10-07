/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/metronome/",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        mode: "development",
        globPatterns: ["**/*"]
      },
      manifest: {
        name: "Metronome",
        short_name: "Metronome",
        icons: [
          {
            src: "logo-maskable-bg-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-maskable-bg-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo-maskable-bg-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "logo-maskable-bg-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "logo-maskable-bg.svg",
            type: "image/svg+xml",
          },
          {
            src: "logo-maskable-bg.svg",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "logo-maskable-bg.svg",
            type: "image/svg+xml",
            purpose: "maskable"
          },
          {
            src: "logo.svg",
            type: "image/svg+xml",
            purpose: "monochrome",
          },
        ],
        theme_color: "#333333",
        background_color: "#333333",
        display: "standalone",
      },
    }),
    svgr(),
    react(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // css: true,
  },
});
