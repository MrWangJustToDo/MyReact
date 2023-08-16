import { rollupWatch } from "project-tool/rollup";

const external = (id: string) => id.includes("@my-react/") || id.includes("node_modules");

rollupWatch({ packageName: "myreact-reconciler", packageScope: "packages", external });

rollupWatch({ packageName: "myreact-dom", packageScope: "packages", external });
