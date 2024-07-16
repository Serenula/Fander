import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-router-dom"], // Ensure react-router-dom is included in optimized dependencies
  },
  server: {
    fs: {
      strict: false, // Allow Vite to handle non-ES module imports gracefully
    },
  },
});
