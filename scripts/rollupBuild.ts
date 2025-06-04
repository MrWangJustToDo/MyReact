import alias from "@rollup/plugin-alias";
import { spawnSync } from "child_process";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { rollupBuild } from "project-tool/rollup";

const external = (id: string) => id.includes("@my-react/") || (id.includes("node_modules") && !id.includes("tslib"));

const writeType = async (packageName: string) => {
  if (packageName === "myreact") {
    const indexPath = resolve(process.cwd(), "packages", packageName, "index.d.ts");
    await writeFile(
      indexPath,
      `export * from "./dist/types";
`
    );
    const jsxPath = resolve(process.cwd(), "packages", packageName, "jsx-runtime.d.ts");
    await writeFile(
      jsxPath,
      `import { jsx, jsxs, Fragment } from "@my-react/react-jsx";

export { jsx, jsxs, Fragment };
`
    );
    const jsxDevPath = resolve(process.cwd(), "packages", packageName, "jsx-dev-runtime.d.ts");
    await writeFile(
      jsxDevPath,
      `import { jsxDEV, Fragment } from "@my-react/react-jsx";

export { jsxDEV, Fragment };
`
    );
  } else if (packageName === "myreact-dom") {
    const indexPath = resolve(process.cwd(), "packages", packageName, "index.d.ts");
    await writeFile(
      indexPath,
      `export * from "./dist/types";
`
    );
    const clientPath = resolve(process.cwd(), "packages", packageName, "client.d.ts");
    await writeFile(
      clientPath,
      `export * from "./dist/types/client";
`
    );
    const serverPath = resolve(process.cwd(), "packages", packageName, "server.d.ts");
    await writeFile(
      serverPath,
      `export * from "./dist/types/server";
`
    );
  }
};

export const externalReact = (id: string) =>
  id.endsWith("@my-react/react") ||
  id.endsWith("@my-react/react-dom") ||
  id.includes("@my-react/react-refresh") ||
  id.endsWith("@my-react/react-terminal") ||
  (id.includes("node_modules") && !id.includes("tslib"));

export const externalReactLib = (id: string) =>
  externalReact(id) || id.includes("@my-react/react-jsx") || id.includes("@my-react/react/jsx-runtime") || id.includes("@my-react/react/jsx-dev-runtime");

const buildPackages = async () => {
  await rollupBuild({ packageName: "myreact-shared", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact", packageScope: "packages", external: externalReact });
  await writeType("myreact");
  await rollupBuild({ packageName: "myreact-jsx", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-reconciler", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-reconciler-compact", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-dom", packageScope: "packages", external: externalReact });
  await writeType("myreact-dom");
  await rollupBuild({
    packageName: "myreact-terminal",
    packageScope: "packages",
    external: externalReactLib,
    plugins: {
      singleOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
    },
  });
  await rollupBuild({
    packageName: "myreact-three-fiber",
    packageScope: "packages",
    external: externalReactLib,
    plugins: {
      singleOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
    },
  });
  await rollupBuild({ packageName: "myreact-reactivity", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-refresh", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-vite", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-refresh-tools", packageScope: "packages", external: externalReact });
};

const buildRSPack = () => spawnSync("cd packages/myreact-rspack && pnpm build", { shell: true, stdio: "inherit" });

const start = async () => {
  await buildPackages();
  buildRSPack();
  await rollupBuild({ packageName: "graphql", packageScope: "site", external });
  await rollupBuild({ packageName: "webpack", packageScope: "site", external });
  process.exit(0);
};

start();
