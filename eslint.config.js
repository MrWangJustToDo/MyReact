const baseLint = require("project-tool/baseLint");
const reactLint = require("project-tool/reactLint");
const reactCompiler = require("eslint-plugin-react-compiler");

module.exports = [
  // Global ignores
  {
    ignores: ["dist", "dev", "lib", "__tests__", "bundle", "ui/vite-example", "ui/remix-example/postcss.config.cjs", "ui/remix-example/vite.config.ts"],
  },

  // Base config for all files
  ...baseLint,
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // React config for ui/* and site/graphql
  {
    files: ["ui/csr-example/**/*.{ts,tsx}", "ui/ssr-example/**/*.{ts,tsx}", "ui/remix-example/**/*.{ts,tsx}", "site/graphql/**/*.{ts,tsx}"],
    ...reactLint.reduce((acc, config) => {
      return {
        ...acc,
        ...config,
        plugins: { ...acc.plugins, ...config.plugins },
        rules: { ...acc.rules, ...config.rules },
        settings: { ...acc.settings, ...config.settings },
      };
    }, {}),
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // SSR example specific: react-compiler plugin
  {
    files: ["ui/ssr-example/**/*.{ts,tsx}"],
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
      "react/no-unknown-property": "off",
    },
  },
];
