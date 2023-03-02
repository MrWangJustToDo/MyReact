module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier", "plugin:import/recommended", "plugin:import/typescript"],
  ignorePatterns: ["dist", "dev", "lib", "__tests__", "bundle", "**/*.d.ts", "**/*.js", "**/*.jsx", "node_modules"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",

    "@typescript-eslint/explicit-function-return-type": "off",

    "@typescript-eslint/explicit-module-boundary-types": "off",

    "@typescript-eslint/no-explicit-any": "off",

    "@typescript-eslint/consistent-type-imports": "error",

    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: "^_",
      },
    ],

    "import/first": "error",

    "import/newline-after-import": "error",

    "import/no-duplicates": "error",

    "import/order": [
      "error",
      {
        groups: [["builtin", "external"], "internal", "parent", "sibling", "index", "type"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    "import/newline-after-import": ["error", { count: 1 }],

    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default
      },
    },
  },
};
