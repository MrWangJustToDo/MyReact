function isWebTarget(caller) {
  return Boolean(caller && caller.target === "web");
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === "babel-loader");
}

module.exports = (api) => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);

  api.cache.using(() => process.env.NODE_ENV === "production");

  const presets = [];
  const plugins = [];

  presets.push([
    "@babel/preset-env",
    {
      useBuiltIns: web ? "entry" : undefined,
      corejs: web ? "core-js@3" : false,
      targets: !web ? { node: "current" } : undefined,
      modules: webpack ? false : "commonjs",
    },
  ]);
  presets.push("@babel/preset-typescript");
  // new react jsx runtime support. SEE https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#removing-unused-react-imports
  // presets.push(["@babel/preset-react", { development: !api.env("production"), runtime: process.env.REACT === "react" ? "automatic" : "classic" }]);
  presets.push([
    "@babel/preset-react",
    { development: !api.env("production"), runtime: "automatic", importSource: process.env.REACT === "react" ? "react" : "@my-react/react-jsx" },
  ]);

  plugins.push(["@babel/plugin-proposal-decorators", { legacy: true }]);
  plugins.push(["@babel/plugin-proposal-class-properties", { loose: true }]);
  plugins.push(["@babel/plugin-proposal-private-methods", { loose: true }]);
  plugins.push(["@babel/plugin-proposal-private-property-in-object", { loose: true }]);
  plugins.push("@babel/plugin-transform-runtime");
  plugins.push("@babel/plugin-proposal-export-default-from");
  plugins.push("@loadable/babel-plugin");

  return {
    presets,
    plugins,
  };
};
