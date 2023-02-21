import path from "path";

import { MANIFEST } from "@build/webpack/utils";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

export const manifestLoadableFile = (env: "server" | "client"): string => path.resolve(outputPath(env), MANIFEST.manifest_loadable);
