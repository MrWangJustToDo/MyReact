import { defineConfig } from "vite";
import react from "@my-react/react-vite";

export default defineConfig({
  plugins: [
    react({
      rsc: true,
      rscEndpoint: "/__rsc",
      rscActionEndpoint: "/__rsc_action",
    }),
  ],
  server: {
    port: 3000,
  },
});
