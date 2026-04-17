import alias from "@rollup/plugin-alias";
import { spawnSync } from "child_process";
import { rollupBuild } from "project-tool/rollup";

const external = (id: string) =>
  id.includes("@my-react/") ||
  (id.includes("node_modules") && !id.includes("tslib")) ||
  (!id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0") && !id.includes("tslib"));

export const externalReact = (id: string) =>
  id.endsWith("@my-react/react") ||
  id.includes("@my-react/react-dom") ||
  id.includes("@my-react/react-server") ||
  id.includes("@my-react/react-refresh") ||
  id.endsWith("@my-react/react-terminal") ||
  (id.includes("node_modules") && !id.includes("tslib"));

export const externalReactLib = (id: string) =>
  externalReact(id) || id.includes("@my-react/react-jsx") || id.includes("@my-react/react/jsx-runtime") || id.includes("@my-react/react/jsx-dev-runtime");

// ==== build ==== //
const myreactShared = () => rollupBuild({ packageName: "myreact-shared", packageScope: "packages", external: externalReact });
const myreact = async () => {
  await rollupBuild({ packageName: "myreact", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-jsx", packageScope: "packages", external: externalReact });
};
const myreactReconciler = async () => {
  await rollupBuild({ packageName: "myreact-reconciler", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-reconciler-compact", packageScope: "packages", external: externalReact });
};
const myreactDom = async () => {
  await rollupBuild({ packageName: "myreact-dom", packageScope: "packages", external: externalReact });
};
const myreactThird = async () => {
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
    packageName: "myreact-opentui",
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
  await rollupBuild({
    packageName: "myreact-reactivity",
    packageScope: "packages",
    external: externalReact,
    plugins: {
      multipleDevUMD({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
      multipleProdUMD({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
      multipleDevOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
      multipleProdOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
    },
  });
};
const myreactServer = () =>
  rollupBuild({
    packageName: "myreact-server",
    packageScope: "packages",
    external: externalReact,
  });
const myreactDev = async () => {
  await rollupBuild({ packageName: "myreact-refresh", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-vite", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-refresh-tools", packageScope: "packages", external: externalReact });
  spawnSync("cd packages/myreact-rspack && pnpm build", { shell: true, stdio: "inherit" });
};

const myreactLynx = () => {
  spawnSync("cd packages/myreact-lynx && pnpm build", { shell: true, stdio: "inherit" });
};

const buildPackages = async () => {
  await myreactShared();
  await myreact();
  await myreactReconciler();
  await myreactDom();
  await myreactServer();
  await myreactDev();
  await myreactThird();
  await myreactLynx();
};

const start = async () => {
  await buildPackages();
  await rollupBuild({ packageName: "graphql", packageScope: "site", external });
  await rollupBuild({ packageName: "webpack", packageScope: "site", external });
  process.exit(0);
};

start();
// myreactThird();
// myreactReconciler();
// myreact();
// myreactLynx();
// myreactDev();
