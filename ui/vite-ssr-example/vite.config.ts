import my_react from "@my-react/react-vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // see https://github.com/vitejs/vite/issues/2579
  /* ssr: {
    noExternal: ["react", "react-dom", "@my-react/react-jsx"],
  }, */
  plugins: [my_react()],
});
