import path from "path";

const outputPath = (env: "server" | "client"): string => (__DEVELOPMENT__ ? path.resolve(process.cwd(), "dev", env) : path.resolve(process.cwd(), "dist", env));

const manifestFile = (): string => (__DEVELOPMENT__ ? "manifest-dev.json" : "manifest-prod.json");

const manifestLoadable = (env: "server" | "client"): string => path.resolve(outputPath(env), "manifest-loadable.json");

export { manifestFile, manifestLoadable };
