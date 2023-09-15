import { MANIFEST } from "@site/webpack";
import path from "path";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

export const manifestLoadableFile = (env: "server" | "client"): string => path.resolve(outputPath(env), MANIFEST.manifest_loadable);
