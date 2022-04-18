module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "core-js@3",
        modules: false,  // use webserver to view index.html
      },
    ],
    "@babel/preset-react",
  ],
};
