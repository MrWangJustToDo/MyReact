// ES modules wrapper
/* eslint-disable */
import pluginModule from "../dist/index.js";

const ReactRefreshRspackPlugin = pluginModule?.ReactRefreshRspackPlugin ?? pluginModule?.default ?? pluginModule;

// default export will be deprecated in next major version
export default ReactRefreshRspackPlugin;
