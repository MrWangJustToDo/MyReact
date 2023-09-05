import { defineConfig } from "vite";
import react from "@my-react/react-vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      react: "@my-react/react",
      "react-dom": "@my-react/react-dom",
    },
    preserveSymlinks: true,
    dedupe: ["@my-react/react", "@my-react/react-dom"],
  },
  optimizeDeps: {
    include: ["@my-react/react", "@my-react/react-dom", "@my-react/react-dom/client"],
  },
  plugins: [react()],
});
