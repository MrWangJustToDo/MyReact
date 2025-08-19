import react from "@my-react/react-vite";
// import react from '@vitejs/plugin-react';
import { defineConfig } from "vite";

// !SEE https://github.com/vitejs/vite/issues/12738
// !build will fail when using monorepo symlinks, npm install works fine, so build always fails in this case
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['@my-react/react-three-fiber', '@react-three/fiber'],
  },
  resolve: {
    dedupe: ["@my-react/react-three-fiber", "@react-three/fiber"],
  },
  plugins: [react()],
});
