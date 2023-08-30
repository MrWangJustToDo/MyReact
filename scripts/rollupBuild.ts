import { rollupBuild } from "project-tool/rollup";

const external = (id: string) => id.includes("@my-react/") || id.includes("node_modules");

const externalReact = (id: string) =>
  id.endsWith("@my-react/react") || id.endsWith("@my-react/react-dom") || id.includes("@my-react/react-refresh") || id.includes("node_modules");

const start = async () => {
  await rollupBuild({ packageName: "myreact-shared", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-jsx", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-reconciler", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-dom", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-reactivity", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-refresh", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-refresh-tools", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "graphql", packageScope: "site", external });
  process.exit(0);
};

start();
