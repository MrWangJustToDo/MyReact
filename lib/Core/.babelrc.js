module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "core-js@3",
        // modules: false, // use webserver to view index.html
        targets: { chrome: "80" },
      },
    ],
    "@babel/preset-react",
  ],
};
