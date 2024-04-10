import { rollupWatch } from "project-tool/rollup";

const external = (id: string) => id.includes("@my-react/") || (id.includes("node_modules") && !id.includes("tslib"));

rollupWatch({ packageName: "myreact-reconciler", packageScope: "packages", external });

// rollupWatch({ packageName: "myreact-dom", packageScope: "packages", external });

rollupWatch({ packageName: "myreact-terminal", packageScope: "packages", external: external });
