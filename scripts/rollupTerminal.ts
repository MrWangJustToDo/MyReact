/* eslint-disable @typescript-eslint/no-unused-vars */
import { rollupBuild, rollupWatch } from "project-tool/rollup";

export const externalReact = (id: string) =>
  id.endsWith("@my-react/react") ||
  id.endsWith("/react/jsx-runtime") ||
  id.endsWith("/react/jsx-dev-runtime") ||
  id.endsWith("@my-react/react-dom") ||
  id.includes("@my-react/react-refresh") ||
  id.endsWith("@my-react/react-terminal") ||
  id.endsWith("@my-react/react-opentui") ||
  (id.includes("node_modules") && !id.includes("tslib"));

const build = async () => {
  await rollupBuild({ packageName: "terminal", packageScope: "test", external: externalReact });
  await rollupBuild({ packageName: "opentui", packageScope: "test", external: externalReact });
};

const watch = () => {
  rollupWatch({ packageName: "terminal", packageScope: "test", external: externalReact });
};

build();

// watch();
