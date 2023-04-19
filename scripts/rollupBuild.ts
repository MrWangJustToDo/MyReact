import { rollupBuild } from "project-tool/rollup";

const external = (id: string) => id.includes("@my-react/") || id.includes("node_modules");

const start = async () => {
  await rollupBuild({ packageName: "myreact-shared", packageScope: "packages", external });
  await rollupBuild({ packageName: "myreact", packageScope: "packages", external });
  await rollupBuild({ packageName: "myreact-jsx", packageScope: "packages", external });
  await rollupBuild({ packageName: "myreact-reconciler", packageScope: "packages", external });
  await rollupBuild({ packageName: "myreact-dom", packageScope: "packages", external });
  await rollupBuild({ packageName: "myreact-reactivity", packageScope: "packages", external });
  await rollupBuild({ packageName: "myreact-refresh", packageScope: "packages", external });
  await rollupBuild({ packageName: "graphql", packageScope: "site", external });
  process.exit(0);
};

start();
