module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "core-js@3",
        targets: { chrome: "80" },
      },
    ],
    "@babel/preset-react",
  ],
};
