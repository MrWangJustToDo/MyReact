/**
 * @file RSC Plugins Index
 * Re-exports all plugin modules
 */

export { createTransformPlugin } from "./transform-plugin";
export type { TransformPluginContext } from "./transform-plugin";

export { createDevServerPlugin, injectRSCPayloadIntoHTML } from "./dev-server-plugin";
export type { DevServerPluginOptions } from "./dev-server-plugin";

export { createConditionsPlugin } from "./conditions-plugin";

export { createBootstrapPlugin } from "./bootstrap-plugin";
export type { BootstrapPluginOptions } from "./bootstrap-plugin";

// Build-related plugins
export { createBuildPlugin, collectAssetDeps, assetsURLOfDeps } from "./build-plugin";
export type { BuildPluginOptions } from "./build-plugin";

export { createScanPlugin, transformScanBuildStrip, shouldScanModule } from "./scan-plugin";

export {
  createVirtualModulesPlugin,
  VIRTUAL_CLIENT_REFERENCES,
  VIRTUAL_ASSETS_MANIFEST,
  VIRTUAL_SERVER_REFERENCES,
  VIRTUAL_ENTRY_BROWSER,
  toVirtualId,
  isVirtualId,
} from "./virtual-modules-plugin";

export { createCrossEnvPlugin } from "./cross-env-plugin";
