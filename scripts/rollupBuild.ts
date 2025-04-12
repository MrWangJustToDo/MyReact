import { spawnSync } from "child_process";
import { rollupBuild } from "project-tool/rollup";

const external = (id: string) => id.includes("@my-react/") || (id.includes("node_modules") && !id.includes("tslib"));

const externalReact = (id: string) =>
  id.endsWith("@my-react/react") ||
  id.endsWith("@my-react/react-dom") ||
  id.includes("@my-react/react-refresh") ||
  (id.includes("node_modules") && !id.includes("tslib"));

const buildPackages = async () => {
  await rollupBuild({ packageName: "myreact-shared", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-jsx", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-reconciler", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-dom", packageScope: "packages", external: externalReact });
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
