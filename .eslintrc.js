module.exports = {
  root: true,
  env: {
    node: true,
  },
  // eslint will auto add `eslint-config` for a no scope package(which not start with '@' chart), so here use absolute file path
  extends: [require.resolve("project-tool/baseLint")],
  ignorePatterns: ["dist", "dev", "lib", "__tests__", "bundle", "ui/vite-example"],
  rules: {
    "@typescript-eslint/no-unused-expressions": "off",
  },
};
