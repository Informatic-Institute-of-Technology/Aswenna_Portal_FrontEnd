import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/shared/components"),
      "@/hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/layouts": path.resolve(__dirname, "./src/layouts"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/core": path.resolve(__dirname, "./src/core"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  server: {
    proxy: {
      "/nsdi-api": {
        target: "https://gisapps.nsdi.gov.lk",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nsdi-api/, ""),
      },
    },
  },
});
