/* eslint-disable @typescript-eslint/no-unused-vars */
import { rollupBuild, rollupWatch } from "project-tool/rollup";

export const externalReact = (id: string) =>
  id.endsWith("@my-react/react") ||
  id.endsWith("@my-react/react-dom") ||
  id.includes("@my-react/react-refresh") ||
  id.endsWith("@my-react/react-terminal") ||
  (id.includes("node_modules") && !id.includes("tslib"));

const build = async () => {
  await rollupBuild({ packageName: "terminal", packageScope: "test", external: externalReact });
};

const watch = () => {
  rollupWatch({ packageName: "terminal", packageScope: "test", external: externalReact });
};

build();

// watch();
