// React Refresh runtime must stay on Background only.
// With enableIFR, MT also imports this module for sync mount — do not pull
// refresh helpers / performReactRefresh into the Main Thread bundle.
if (__HMR__ && typeof __BACKGROUND__ !== "undefined" && __BACKGROUND__) {
  // inject global hmr runtime for @my-react, so we need jsx import source is @my-react/react-lynx/jsx-dev-runtime
  require("@my-react/react-refresh-tools/runtime");
}

module.exports = require("@my-react/react/jsx-dev-runtime");
