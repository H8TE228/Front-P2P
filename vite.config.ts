import path from "path";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/api/*": path.resolve(__dirname, "./src/api/*"),
      "@/assets/*": path.resolve(__dirname, "./src/assets/*"),
      "@/components/*": path.resolve(__dirname, "./src/components/*"),
      "@/constants/*": path.resolve(__dirname, "./src/constants/*"),
      "@/features/*": path.resolve(__dirname, "./src/features/*"),
      "@/hooks/*": path.resolve(__dirname, "./src/hooks/*"),
      "@/lib/*": path.resolve(__dirname, "./src/lib/*"),
      "@/pages/*": path.resolve(__dirname, "./src/pages/*"),
      "@/store/*": path.resolve(__dirname, "./src/store/*"),
      "@/types/*": path.resolve(__dirname, "./src/types/*"),
    },
  },
  server: {
    open: true,
    proxy: {
      "/api/v1": {
        // target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
