/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
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

  build: {
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
    include: [path.resolve(__dirname, "./tests/*.test.ts")],
    globals: true,
    environment: "jsdom",
    css: true,
  },
});
