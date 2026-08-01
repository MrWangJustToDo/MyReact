import alias from "@rollup/plugin-alias";
import { spawnSync } from "child_process";
import { rollupBuild } from "project-tool/rollup";

const external = (id: string) =>
  id.includes("@my-react/") ||
  (id.includes("node_modules") && !id.includes("tslib")) ||
  (!id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0") && !id.includes("tslib"));

export const externalReact = (id: string) => {
  // Do not externalize `@my-react/react/type` — leave it for @rollup/plugin-alias to
  // rewrite to `@my-react/react`, otherwise Rollup skips alias and keeps `/type`.
  if (id === "@my-react/react/type") return false;

  return (
    id === "@my-react/react" ||
    id.startsWith("@my-react/react/") ||
    id.includes("@my-react/react-dom") ||
    id.includes("@my-react/react-server") ||
    id.includes("@my-react/react-refresh") ||
    id.endsWith("@my-react/react-terminal") ||
    (id.includes("node_modules") && !id.includes("tslib"))
  );
};

export const externalReactLib = (id: string) =>
  externalReact(id) || id.includes("@my-react/react-jsx") || id.includes("@my-react/react/jsx-runtime") || id.includes("@my-react/react/jsx-dev-runtime");

/** `@my-react/react/type` → `@my-react/react` (must run before node-resolve / typescript). */
const REACT_TYPE_ALIAS = {
  find: /^@my-react\/react\/type$/,
  replacement: "@my-react/react",
  // Skip further resolve; emit a single external `@my-react/react`.
  customResolver: {
    resolveId(source: string) {
      return { id: source, external: true };
    },
  },
};

const createAliasPlugin = (...entries: Array<{ find: string | RegExp; replacement: string }>) =>
  alias({
    entries: [REACT_TYPE_ALIAS, ...entries],
  });

const withReactTypeAlias = (entries: Array<{ find: string | RegExp; replacement: string }> = []) => {
  const inject = ({ defaultPlugins }: { defaultPlugins: any[] }) => [createAliasPlugin(...entries), ...defaultPlugins];

  return {
    singleOther: inject,
    singleDevUMD: inject,
    multipleDevOther: inject,
    multipleProdOther: inject,
    multipleDevUMD: inject,
    multipleProdUMD: inject,
  };
};

// ==== build ==== //
const myreactShared = () => rollupBuild({ packageName: "myreact-shared", packageScope: "packages", external: externalReact, plugins: withReactTypeAlias() });
const myreact = async () => {
  await rollupBuild({ packageName: "myreact", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-jsx", packageScope: "packages", external: externalReact, plugins: withReactTypeAlias() });
};
const myreactReconciler = async () => {
  await rollupBuild({
    packageName: "myreact-reconciler",
    packageScope: "packages",
    external: externalReact,
    plugins: withReactTypeAlias(),
  });
  await rollupBuild({
    packageName: "myreact-reconciler-compact",
    packageScope: "packages",
    external: externalReact,
    plugins: withReactTypeAlias(),
  });
};
const myreactDom = async () => {
  await rollupBuild({ packageName: "myreact-dom", packageScope: "packages", external: externalReact, plugins: withReactTypeAlias() });
};
const myreactThird = async () => {
  await rollupBuild({
    packageName: "myreact-terminal",
    packageScope: "packages",
    external: (id) => {
      if (id === "@xterm/xterm" || id === "@xterm/addon-fit") return true;
      const re = externalReactLib(id);
      if (re) {
        if (id.includes("stack-utils") || id.includes("escape-string-regexp") || id.includes("ansi-escapes")) return false;
      }
      return re;
    },
    plugins: {
      singleOther({ defaultPlugins, defaultPluginProps, defaultPluginPackages }) {
        const input = typeof defaultPluginProps.options.input === "string" ? defaultPluginProps.options.input : "";
        const isWebEntry = input.includes("web/index");
        const reactAlias = { find: "react", replacement: "@my-react/react" };

        if (isWebEntry) {
          const shimsDir = defaultPluginProps.absolutePath + "/src/web/shims";

          return [
            createAliasPlugin(
              reactAlias,
              // Node.js built-in shims
              { find: "module", replacement: shimsDir + "/module.ts" },
              { find: "node:module", replacement: shimsDir + "/module.ts" },
              { find: "os", replacement: shimsDir + "/os.ts" },
              { find: "node:os", replacement: shimsDir + "/os.ts" },
              { find: "process", replacement: shimsDir + "/process.ts" },
              { find: "node:process", replacement: shimsDir + "/process.ts" },
              { find: "stream", replacement: shimsDir + "/stream.ts" },
              { find: "node:stream", replacement: shimsDir + "/stream.ts" },
              { find: "events", replacement: shimsDir + "/events.ts" },
              { find: "node:events", replacement: shimsDir + "/events.ts" },
              { find: "fs", replacement: shimsDir + "/fs.ts" },
              { find: "node:fs", replacement: shimsDir + "/fs.ts" },
              { find: "buffer", replacement: shimsDir + "/buffer.ts" },
              { find: "node:buffer", replacement: shimsDir + "/buffer.ts" },
              { find: "child_process", replacement: shimsDir + "/child_process.ts" },
              { find: "node:child_process", replacement: shimsDir + "/child_process.ts" },
              { find: "url", replacement: shimsDir + "/url.ts" },
              { find: "node:url", replacement: shimsDir + "/url.ts" },
              { find: "path", replacement: shimsDir + "/path.ts" },
              { find: "node:path", replacement: shimsDir + "/path.ts" },
              { find: "tty", replacement: shimsDir + "/tty.ts" },
              { find: "node:tty", replacement: shimsDir + "/tty.ts" },
              // Node.js-only npm package shims
              { find: "signal-exit", replacement: shimsDir + "/signal-exit.ts" },
              { find: "cli-cursor", replacement: shimsDir + "/cli-cursor.ts" },
              { find: "patch-console", replacement: shimsDir + "/patch-console.ts" },
              { find: "is-in-ci", replacement: shimsDir + "/is-in-ci.ts" },
              { find: "environment", replacement: shimsDir + "/environment.ts" }
            ),
            ...defaultPlugins,
            defaultPluginPackages.replace({ __WEB__: "true", preventAssignment: true }),
          ];
        }

        return [createAliasPlugin(reactAlias), ...defaultPlugins, defaultPluginPackages.replace({ __WEB__: "false", preventAssignment: true })];
      },
    },
  });
  await rollupBuild({
    packageName: "myreact-opentui",
    packageScope: "packages",
    external: externalReactLib,
    plugins: withReactTypeAlias([{ find: "react", replacement: "@my-react/react" }]),
  });
  await rollupBuild({
    packageName: "myreact-three-fiber",
    packageScope: "packages",
    external: externalReactLib,
    plugins: withReactTypeAlias([{ find: "react", replacement: "@my-react/react" }]),
  });
  await rollupBuild({
    packageName: "myreact-reactivity",
    packageScope: "packages",
    external: externalReact,
    plugins: withReactTypeAlias([{ find: "react", replacement: "@my-react/react" }]),
  });
};
const myreactServer = () =>
  rollupBuild({
    packageName: "myreact-server",
    packageScope: "packages",
    external: externalReact,
    plugins: withReactTypeAlias(),
  });
const runPkgScript = (command: string, label: string) => {
  const result = spawnSync(command, { shell: true, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`[build] ${label} failed with exit code ${result.status ?? "unknown"}`);
  }
};

const myreactDev = async () => {
  await rollupBuild({
    packageName: "myreact-refresh",
    packageScope: "packages",
    external: externalReact,
    plugins: withReactTypeAlias(),
  });
  await rollupBuild({
    packageName: "myreact-vite",
    packageScope: "packages",
    external: externalReact,
    plugins: withReactTypeAlias(),
  });
  await rollupBuild({
    packageName: "myreact-refresh-tools",
    packageScope: "packages",
    external: externalReact,
    plugins: withReactTypeAlias(),
  });
  runPkgScript("cd packages/myreact-rspack && pnpm build", "@my-react/react-rspack");
};

const myreactLynx = () => {
  runPkgScript("cd packages/myreact-lynx && pnpm build", "@my-react/react-lynx");
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
// myreact();
// myreactServer();
// myreactThird();
// myreactReconciler();
// myreact();
// myreactLynx();
// myreactDev();
