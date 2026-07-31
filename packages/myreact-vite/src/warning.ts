import type { BuildOptions, UserConfig } from "vite";

/** Expand Vite's default `/node_modules/` so workspace CJS entries interop under Rollup. */
export const workspaceCommonjsInclude = [/node_modules/, /packages\/myreact/, /@my-react\//];

export const silenceUseClientWarning = (userConfig: UserConfig): BuildOptions => ({
  rollupOptions: {
    onwarn(warning, defaultHandler) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && (warning.message.includes("use client") || warning.message.includes("use server"))) {
        return;
      }
      // https://github.com/vitejs/vite/issues/15012
      if (warning.code === "SOURCEMAP_ERROR" && warning.message.includes("resolve original location") && warning.pos === 0) {
        return;
      }
      if (userConfig.build?.rollupOptions?.onwarn) {
        userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
      } else {
        defaultHandler(warning);
      }
    },
  },
});

/**
 * Build options for monorepo / npm-alias links of `@my-react/*`.
 * Only expands `commonjsOptions.include` — Vite deep-merges the rest of the user's options.
 */
export const withMyReactBuildOptions = (userConfig: UserConfig): BuildOptions => {
  const userInclude = userConfig.build?.commonjsOptions?.include;
  const extraInclude = userInclude == null ? [] : Array.isArray(userInclude) ? userInclude : [userInclude];

  return {
    ...silenceUseClientWarning(userConfig),
    commonjsOptions: {
      include: [...workspaceCommonjsInclude, ...extraInclude],
    },
  };
};
