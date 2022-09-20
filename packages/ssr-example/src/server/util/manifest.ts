import path from "path";

import { MANIFEST } from "@build/webpack/utils";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev.json" : "manifest-prod.json");

const manifestStateFile = (env: "server" | "client"): string => path.resolve(outputPath(env), manifestFile());

const manifestLoadableFile = (env: "server" | "client"): string => path.resolve(outputPath(env), MANIFEST.manifest_loadable);

export { manifestStateFile, manifestLoadableFile };
