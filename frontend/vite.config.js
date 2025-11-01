import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No import of '@tailwindcss/vite'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        //Our backend
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
