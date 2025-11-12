import { readdir, rm } from "node:fs/promises";
import { resolve } from "path";

const pkgNameAlias = {
  "@my-react/react": "myreact",
  "@my-react/react-dom": "myreact-dom",
  "@my-react/react-jsx": "myreact-jsx",
  "@my-react/react-reactive": "myreact-reactivity",
  "@my-react/react-reconciler": "myreact-reconciler",
  "@my-react/react-refresh": "myreact-refresh",
  "@my-react/react-shared": "myreact-shared",
  "@my-react/react-refresh-tools": "myreact-refresh-tools",
  "@my-react/react-vite": "myreact-vite",
  "@my-react/react-rspack": "myreact-rspack",
  "@my-react/react-terminal": "myreact-terminal",
};

const cleanTypeFile = async (pkgName: keyof typeof pkgNameAlias) => {
  const dirPath = resolve(process.cwd(), "packages", pkgNameAlias[pkgName]);
  const dirs = await readdir(dirPath, { withFileTypes: true });

  for (const item of dirs) {
    if (item.isFile() && item.name.endsWith(".d.ts") && !item.name.includes("jsx") && item.name !== "type.d.ts") {
      const filePath = resolve(dirPath, item.name);
      await rm(filePath, { force: true });
    }
  }

  // const distType = resolve(process.cwd(), "packages", pkgNameAlias[pkgName], "dist", "types");

  // await rm(distType, { force: true, recursive: true });
};

cleanTypeFile("@my-react/react");
cleanTypeFile("@my-react/react-dom");
