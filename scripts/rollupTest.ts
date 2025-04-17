import { rollupBuild } from "project-tool/rollup";

export const externalReact = (id: string) =>
  id.endsWith("@my-react/react") ||
  id.endsWith("@my-react/react-dom") ||
  id.includes("@my-react/react-refresh") ||
  id.endsWith("@my-react/react-terminal") ||
  (id.includes("node_modules") && !id.includes("tslib"));

const run = async () => {
  await rollupBuild({ packageName: "terminal", packageScope: "test", external: externalReact });
}

run();