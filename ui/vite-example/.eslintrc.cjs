module.exports = {
  extends: [require.resolve("project-tool/baseLint"), require.resolve("project-tool/reactLint")],
  env: {
    browser: true,
    es2021: true,
  },
  exclude: [".eslintrc.cjs", "postcss.config.cjs"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
