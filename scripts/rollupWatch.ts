import { rollupWatch } from "project-tool/rollup";

export const externalReact = (id: string) =>
  id === "@my-react/react" ||
  id.startsWith("@my-react/react/") ||
  id.includes("@my-react/react-dom") ||
  id.includes("@my-react/react-refresh") ||
  id.endsWith("@my-react/react-terminal") ||
  (id.includes("node_modules") && !id.includes("tslib"));

rollupWatch({ packageName: "myreact-reconciler", packageScope: "packages", external: externalReact });
rollupWatch({ packageName: "myreact-terminal", packageScope: "packages", external: externalReact });

// rollupWatch({ packageName: "myreact-dom", packageScope: "packages", external });
