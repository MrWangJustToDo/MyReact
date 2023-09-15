import { sources, Compilation } from "webpack";

import { MANIFEST } from "../utils";

import type { Compiler, StatsModule } from "webpack";

// https://github.com/artem-malko/react-ssr-template/blob/main/src/infrastructure/dependencyManager/webpack/plugin.ts
const RawSource = sources.RawSource;
const pluginName = "webpack-page-deps-plugin";

// https://github.com/shellscape/webpack-manifest-plugin/blob/6a521600b0b7dd66db805bf8fb8afaa8c41290cb/src/index.ts#L48
const hashKey = /([a-f0-9]{16,32}\.?)/gi;
const transformExtensions = /^(gz|map)$/i;

const STATIC_PAGE_EXPORT = "isStatic";

export class WebpackPageDepsPlugin {
  fileName: string;

  constructor(p: { fileName?: string } = {}) {
    this.fileName = p.fileName || MANIFEST.manifest_deps;
  }

  public apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise({ name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_REPORT }, () => this.emitStates(compilation));
    });
  }

  public emitStates(compilation: Compilation) {
    const statsChunks = compilation.getStats().toJson().chunks;

    if (!statsChunks) {
      throw new Error("NO CHUNKS IN STATS");
    }

    return Promise.resolve()
      .then(() => {
        const reducedStats = statsChunks.reduce<{
          chunkIdToFileNameMap: { [chunkId: string]: string[] };
          chunkIdToChunkName: {
            [chunkId: string]: {
              name: string;
              id: string | number;
              locName: string;
            };
          };
          chunkIdToModules: { [chunkId: string]: StatsModule[] };
          chunkIdToChildrenIds: { [chunkId: string]: (string | number)[] };
        }>(
          (mutableAcc, statsChunk) => {
            if (!statsChunk.id) {
              return mutableAcc;
            }

            // generate chunk name which keep same with `webpack-manifest-plugin`
            // files contain current chunk all files, like js, css...
            const files = Array.from(statsChunk.files || []).map((fileName) => {
              const replaced = fileName.replace(/\?.*/, "");
              const split = replaced.split(".");
              const extension = split.pop();
              const finalExtension = extension && transformExtensions.test(extension) ? `${split.pop()}.${extension}` : extension;
              const name = statsChunk.names?.[0] ? statsChunk.names?.[0] + "." + finalExtension : fileName;
              return name.replace(hashKey, "");
            });

            mutableAcc.chunkIdToChunkName[statsChunk.id] = {
              id: statsChunk.id,
              name: files[0],
              locName: statsChunk.origins?.[0]?.request as string,
            };

            if (statsChunk.modules) {
              mutableAcc.chunkIdToModules[statsChunk.id] = statsChunk.modules;
            }

            if (files[0]) {
              mutableAcc.chunkIdToFileNameMap[statsChunk.id] = files;
            }

            if (statsChunk.children) {
              mutableAcc.chunkIdToChildrenIds[statsChunk.id] = statsChunk.children.filter((childId) => {
                /**
                 * It's strange, but sometimes it is possible, that current chunk can have one dep
                 * in parents and in children.
                 * To prevent recursion in the next steps, we filter that ids out
                 */
                return !statsChunk.parents?.includes(childId);
              });
            }

            return mutableAcc;
          },
          {
            chunkIdToModules: {},
            chunkIdToFileNameMap: {},
            chunkIdToChunkName: {},
            chunkIdToChildrenIds: {},
          }
        );

        return Object.keys(reducedStats.chunkIdToChunkName).reduce<{ [p: string]: { path: string[]; static: boolean } }>((mutableAcc, chunkId) => {
          const { name: chunkName, locName } = reducedStats.chunkIdToChunkName[chunkId];

          // We do not collect deps for not page's chunks
          if (!chunkName || !/page/i.test(chunkName)) {
            return mutableAcc;
          }

          const childrenIds = reducedStats.chunkIdToChildrenIds[chunkId];

          const modules = reducedStats.chunkIdToModules[chunkId];

          const files = getFiles(reducedStats.chunkIdToFileNameMap, reducedStats.chunkIdToChildrenIds, childrenIds);

          const mainModule = modules.find((item) => !item.dependent);

          const mainExport = mainModule?.providedExports || [];

          const path = locName;

          const isDynamicPage = path.includes("/:");

          mutableAcc[path] = {
            path: [chunkName, ...files],
            static: isDynamicPage ? false : mainExport.some((name) => name === STATIC_PAGE_EXPORT),
          };

          return mutableAcc;
        }, {});
      })
      .then((result) => {
        const resultString = JSON.stringify(result, null, 2);
        const resultStringBuf = Buffer.from(resultString, "utf-8");
        const source = new RawSource(resultStringBuf);
        const filename = this.fileName;

        const asset = compilation.getAsset(filename);

        if (asset) {
          compilation.updateAsset(filename, source);
        } else {
          compilation.emitAsset(filename, source);
        }
      });
  }
}

/**
 * This function has a recurtion inside, cause the first level children can have its own children
 */
const getFiles = (
  chunkIdToFileNameMap: { [chunkId: string]: string[] },
  chunkIdToChildrenIds: { [chunkId: string]: (string | number)[] },
  childrenIds: (string | number)[]
): string[] => {
  const mutableFoundFiles: string[] = [];

  function innerFunc(
    chunkIdToFileNameMap: { [chunkId: string]: string[] },
    chunkIdToChildrenIds: { [chunkId: string]: (string | number)[] },
    childrenIds: (string | number)[]
  ) {
    if (!childrenIds?.length) {
      return mutableFoundFiles;
    }

    childrenIds.forEach((childId) => {
      const fileName = chunkIdToFileNameMap[childId];

      if (chunkIdToChildrenIds[childId]?.length) {
        innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, chunkIdToChildrenIds[childId]);
      }
      if (fileName.length) {
        const needAdd = fileName.filter((f) => !mutableFoundFiles.includes(f));
        mutableFoundFiles.push(...needAdd);
      }
    });
  }

  innerFunc(chunkIdToFileNameMap, chunkIdToChildrenIds, childrenIds);

  return mutableFoundFiles;
};
