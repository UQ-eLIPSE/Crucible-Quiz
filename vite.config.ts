/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
const buildAsLibrary = process.env.BUILDASLIBRARY === "true";
export default defineConfig({
  plugins: [vue()],
  root: fileURLToPath(new URL(".", import.meta.url)),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@type": fileURLToPath(new URL("./src/types", import.meta.url)),
    },
  },

  build: buildAsLibrary && {
    lib: {
      entry: "./src/quizPlugin.ts",
      name: "QuizPlugin",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    include: [path.resolve(__dirname, "./tests/*.test.ts")],
    globals: true,
    environment: "jsdom",
    deps: { inline: ["vitest-canvas-mock"] },
    css: true,
  },
});
