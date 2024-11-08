module.exports = {
  extends: [require.resolve("project-tool/baseLint"), require.resolve("project-tool/reactLint")],
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: [".eslintrc.cjs", "postcss.config.cjs", "vite.config.ts", "!**/.server", "!**/.client"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
