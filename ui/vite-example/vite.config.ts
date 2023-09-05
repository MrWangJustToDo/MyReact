import { defineConfig } from "vite";
import my_react from "@my-react/react-vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  plugins: [my_react()],
});
