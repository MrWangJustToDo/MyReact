import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@my-react/react-vite";

// https://vitejs.dev/config/
export default defineConfig({
  // 使用monorepo软链接时build会失败，npm安装正常，所以在当前案例中 build总是会失败
  // https://github.com/vitejs/vite/issues/12738
  plugins: [react(), vanillaExtractPlugin()],
});
