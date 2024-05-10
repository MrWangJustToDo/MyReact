import my_react from "@my-react/react-vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // vite 最新版本默认本地为esm， 当前打包不包含esm  远程安装应该不会有这个问题
  // see https://github.com/vitejs/vite/issues/2579
  // ssr: {
  //   noExternal: ["@my-react/react", "@my-react/react-dom", "@my-react/react-jsx", /myreact\/jsx-dev-runtime/g],
  // },
  plugins: [my_react()],
});
