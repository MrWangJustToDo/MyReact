import { MANIFEST } from "../utils";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack-dev-server";

type DevServerProps = SafeGenerateActionProps & { publicPath: string };

export const devServerConfig = ({ publicPath, DEV_HOST, WDS_PORT }: DevServerProps): Configuration => ({
  hot: true,
  client: {
    logging: "verbose",
    progress: true,
    reconnect: true,
  },
  compress: true,
  liveReload: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  host: DEV_HOST,
  port: WDS_PORT,
  static: {
    publicPath,
  },
  devMiddleware: {
    publicPath,
    writeToDisk: (fileName) =>
      fileName.includes(MANIFEST.manifest_deps) || fileName.includes(MANIFEST.manifest_dev) || fileName.includes(MANIFEST.manifest_loadable),
  },
});
