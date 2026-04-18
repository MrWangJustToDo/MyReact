if (__HMR__) {
  // inject global hmr runtime for @my-react, so we need jsx import source is @my-react/react-lynx/jsx-dev-runtime
  require('@my-react/react-refresh-tools/runtime');
}

module.exports = require("@my-react/react/jsx-dev-runtime");
