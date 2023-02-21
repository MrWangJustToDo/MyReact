import { manifestStaticPageFile } from "@server/util/webpackManifest";

import {
  getAllStaticRouters,
  getPageManifestContent,
  generateStaticPage as _generateStaticPage,
  getFileNameFromPath,
  prepareOutputPath,
  writeContentToFilePath,
  getStaticPageOutputPath,
} from "./util";

export const generateStaticPage = async () => {
  const allRouters = await getPageManifestContent();
  const allStaticRouters = getAllStaticRouters(allRouters);
  const allStaticRoutersPage = await Promise.all(allStaticRouters.map((pathConfig) => _generateStaticPage(pathConfig)));
  const allStaticRoutersPageWithFilePath = allStaticRoutersPage
    .filter((config) => config.rawData)
    .map((config) => ({
      ...config,
      pathConfig: { ...config.pathConfig, ...getFileNameFromPath(config.pathConfig) },
    }))
    .map((config) => ({ ...config, pathConfig: { ...config.pathConfig, filePath: getStaticPageOutputPath(config.pathConfig.fileName) } }));

  const generateManifest = await Promise.all(
    allStaticRoutersPageWithFilePath.map((config) =>
      prepareOutputPath(config.pathConfig.filePath).then(() =>
        writeContentToFilePath(config.pathConfig.filePath, config.rawData as string)
          .then(() => ({ config, state: true }))
          .catch(() => ({ config, state: false }))
      )
    )
  );

  await writeContentToFilePath(
    manifestStaticPageFile("client"),
    JSON.stringify(
      generateManifest
        .filter((config) => config.state)
        .map((config) => ({ [config.config.pathConfig.p]: config.config.pathConfig.filePath }))
        .reduce((p, c) => ({ ...p, ...c }), {})
    )
  );
};
