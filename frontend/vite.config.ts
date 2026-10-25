import { defineConfig } from "vitest/config";

// One self-contained ES module that the integration serves to the frontend.
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "open-brew-by-weight-cards.js",
    },
    outDir: "../custom_components/open_brew_by_weight/frontend",
    emptyOutDir: true,
    target: "es2022",
    minify: true,
    sourcemap: false,
  },
  test: {
    environment: "happy-dom",
  },
});
