import alias from "@rollup/plugin-alias";
import { spawnSync } from "child_process";
import { rollupBuild } from "project-tool/rollup";

const external = (id: string) =>
  id.includes("@my-react/") ||
  (id.includes("node_modules") && !id.includes("tslib")) ||
  (!id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0") && !id.includes("tslib"));

export const externalReact = (id: string) =>
  id.endsWith("@my-react/react") ||
  id.includes("@my-react/react-dom") ||
  id.includes("@my-react/react-server") ||
  id.includes("@my-react/react-refresh") ||
  id.endsWith("@my-react/react-terminal") ||
  (id.includes("node_modules") && !id.includes("tslib"));

export const externalReactLib = (id: string) =>
  externalReact(id) || id.includes("@my-react/react-jsx") || id.includes("@my-react/react/jsx-runtime") || id.includes("@my-react/react/jsx-dev-runtime");

// ==== build ==== //
const myreactShared = () => rollupBuild({ packageName: "myreact-shared", packageScope: "packages", external: externalReact });
const myreact = async () => {
  await rollupBuild({ packageName: "myreact", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-jsx", packageScope: "packages", external: externalReact });
};
const myreactReconciler = async () => {
  await rollupBuild({ packageName: "myreact-reconciler", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-reconciler-compact", packageScope: "packages", external: externalReact });
};
const myreactDom = async () => {
  await rollupBuild({ packageName: "myreact-dom", packageScope: "packages", external: externalReact });
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
            ...defaultPlugins,
            defaultPluginPackages.replace({ __WEB__: "true", preventAssignment: true }),
            alias({
              entries: [
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
                { find: "environment", replacement: shimsDir + "/environment.ts" },
              ],
            }),
          ];
        }

        return [...defaultPlugins, alias({ entries: [reactAlias] }), defaultPluginPackages.replace({ __WEB__: "false", preventAssignment: true })];
      },
    },
  });
  await rollupBuild({
    packageName: "myreact-opentui",
    packageScope: "packages",
    external: externalReactLib,
    plugins: {
      singleOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
    },
  });
  await rollupBuild({
    packageName: "myreact-three-fiber",
    packageScope: "packages",
    external: externalReactLib,
    plugins: {
      singleOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
    },
  });
  await rollupBuild({
    packageName: "myreact-reactivity",
    packageScope: "packages",
    external: externalReact,
    plugins: {
      multipleDevUMD({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
      multipleProdUMD({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
      multipleDevOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
      multipleProdOther({ defaultPlugins }) {
        return [...defaultPlugins, alias({ entries: [{ find: "react", replacement: "@my-react/react" }] })];
      },
    },
  });
};
const myreactServer = () =>
  rollupBuild({
    packageName: "myreact-server",
    packageScope: "packages",
    external: externalReact,
  });
const myreactDev = async () => {
  await rollupBuild({ packageName: "myreact-refresh", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-vite", packageScope: "packages", external: externalReact });
  await rollupBuild({ packageName: "myreact-refresh-tools", packageScope: "packages", external: externalReact });
  spawnSync("cd packages/myreact-rspack && pnpm build", { shell: true, stdio: "inherit" });
};

const myreactLynx = () => {
  spawnSync("cd packages/myreact-lynx && pnpm build", { shell: true, stdio: "inherit" });
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

// start();
// myreact();
// myreactServer();
// myreactThird();
// myreactReconciler();
// myreact();
myreactLynx();
// myreactDev();
