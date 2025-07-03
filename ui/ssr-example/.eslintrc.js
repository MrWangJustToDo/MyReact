module.exports = {
  extends: [require.resolve("project-tool/baseLint"), require.resolve("project-tool/reactLint")],
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["eslint-plugin-react-compiler"],
  rules: {
    "react-compiler/react-compiler": "error",
    "react/no-unknown-property": "off",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
