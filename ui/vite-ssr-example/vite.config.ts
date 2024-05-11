import my_react from "@my-react/react-vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    optimizeDeps: {
      include: [
        "@my-react/react",
        "@my-react/react-dom",
        "@my-react/react-dom/server",
        "@my-react/react-dom/client",
        "@my-react/react/jsx-runtime",
        "@my-react/react/jsx-dev-runtime",
      ],
    },
    noExternal: ["react-router", "react-router-dom", "react-router-dom/server"],
  },
  plugins: [my_react()],
});
