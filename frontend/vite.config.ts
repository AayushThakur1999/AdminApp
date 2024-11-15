import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "^/(admins|employees)": "http://localhost:8000/api/v1", // match each route with same baseURL
      /* Below is the alternate approach */
      // "/admins": "http://localhost:8000/api/v1",
      // "/employees": "http://localhost:8000/api/v1",
    },
  },
  plugins: [react()],
});
