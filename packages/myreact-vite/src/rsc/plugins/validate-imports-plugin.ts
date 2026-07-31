/**
 * @file Validate server-only / client-only imports
 * Mirrors @vitejs/plugin-rsc validateImportPlugin
 *
 * Rules:
 * - `client-only` must not be imported from the `rsc` environment
 * - `server-only` must not be imported from non-`rsc` environments (ssr/client)
 */

import path from "node:path";

import type { DevEnvironment, Plugin, Rollup } from "vite";

const VIRTUAL_PREFIX = "\0virtual:my-react-rsc/validate-imports/";
const INVALID_PREFIX = `${VIRTUAL_PREFIX}invalid/`;
const VALID_PREFIX = `${VIRTUAL_PREFIX}valid/`;

/**
 * Create the validate-imports plugin (A14)
 */
export function createValidateImportsPlugin(): Plugin {
  return {
    name: "vite:my-react-rsc-validate-imports",

    resolveId: {
      order: "pre",
      async handler(source, _importer, options) {
        // Optimizer scan is not environment-boundary aware
        if (options && "scan" in options && (options as { scan?: boolean }).scan) {
          return;
        }

        if (source !== "client-only" && source !== "server-only") {
          return;
        }

        const envName = this.environment?.name ?? "";
        const invalid = (source === "client-only" && envName === "rsc") || (source === "server-only" && envName !== "rsc");

        return {
          id: `${invalid ? INVALID_PREFIX : VALID_PREFIX}${source}`,
          moduleSideEffects: invalid,
        };
      },
    },

    load(id) {
      if (id.startsWith(INVALID_PREFIX)) {
        const source = id.slice(INVALID_PREFIX.length);
        // Surface as build/dev error; runtime throw as last resort
        return `throw new Error(${JSON.stringify(`[@my-react/react-vite] invalid import of '${source}'`)});`;
      }
      if (id.startsWith(VALID_PREFIX)) {
        return "export {}";
      }
      return null;
    },

    // Dev: walk module graph after transform to produce a clear import chain error
    transform: {
      order: "post",
      async handler(_code, id) {
        if (this.environment?.mode !== "dev") {
          return null;
        }
        if (!id.startsWith(INVALID_PREFIX)) {
          return null;
        }
        const chain = getImportChainDev(this.environment as DevEnvironment, id);
        validateImportChain(chain, this.environment.name, this.environment.config.root);
        return null;
      },
    },

    // Build: inspect module graph at buildEnd
    buildEnd() {
      if (this.environment?.mode !== "build") {
        return;
      }
      validateImportChain(getImportChainBuild(this, `${INVALID_PREFIX}server-only`), this.environment.name, this.environment.config.root);
      validateImportChain(getImportChainBuild(this, `${INVALID_PREFIX}client-only`), this.environment.name, this.environment.config.root);
    },
  };
}

function getImportChainDev(environment: DevEnvironment, id: string): string[] {
  const chain: string[] = [];
  const recurse = (moduleId: string) => {
    if (chain.includes(moduleId)) return;
    const info = environment.moduleGraph.getModuleById(moduleId);
    if (!info) return;
    chain.push(moduleId);
    const next = [...info.importers][0];
    if (next?.id) {
      recurse(next.id);
    }
  };
  recurse(id);
  return chain;
}

function getImportChainBuild(ctx: Rollup.PluginContext, id: string): string[] {
  const chain: string[] = [];
  const recurse = (moduleId: string) => {
    if (chain.includes(moduleId)) return;
    const info = ctx.getModuleInfo(moduleId);
    if (!info) return;
    chain.push(moduleId);
    const next = info.importers[0];
    if (next) {
      recurse(next);
    }
  };
  recurse(id);
  return chain;
}

function validateImportChain(chain: string[], environmentName: string, root: string): void {
  if (chain.length === 0) return;

  const id = chain[0]!;
  const source = id.slice(id.lastIndexOf("/") + 1);
  const buildName = source === "server-only" ? "client" : "server";

  let result = `[@my-react/react-vite] '${source}' cannot be imported in ${buildName} build ('${environmentName}' environment):\n`;
  result += chain
    .slice(1, 6)
    .map((moduleId, i) => " ".repeat(i + 1) + `imported by ${path.relative(root, moduleId).split("\0").join("")}\n`)
    .join("");
  if (chain.length > 6) {
    result += " ".repeat(7) + "...\n";
  }

  const error = new Error(result);
  if (chain[1]) {
    Object.assign(error, { id: chain[1] });
  }
  throw error;
}
