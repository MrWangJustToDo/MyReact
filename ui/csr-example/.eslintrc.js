module.exports = {
  extends: [require.resolve("project-tool/baseLint"), require.resolve("project-tool/reactLint")],
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
  // settings: {
  //   react: {
  //     version: "detect",
  //   },
  //   "import/parsers": {
  //     "@typescript-eslint/parser": [".ts", ".tsx", ".js", ".jsx"],
  //   },
  //   "import/resolver": {
  //     typescript: {
  //       alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

  //       // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default
  //     },
  //   },
  // },
  // rules: {
  //   // General
  //   // "no-console": "warn",

  //   // TypeScript
  //   // We will use TypeScript's types for component props instead
  //   "react/prop-types": "off",

  //   // No need to import React when using Next.js
  //   // "react/react-in-jsx-scope": "off",

  //   // This rule is not compatible with Next.js's <Link /> components
  //   "jsx-a11y/anchor-is-valid": "off",
  // },
};
