module.exports = {
  extends: [require.resolve("project-tool/baseLint"), require.resolve("project-tool/reactLint")],
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
  },
};
