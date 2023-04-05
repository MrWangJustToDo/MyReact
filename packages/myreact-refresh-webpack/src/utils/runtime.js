const NAMESPACE = "__@my-react/react-refresh__";

const createRefreshRuntimeModule = (webpack) =>
  class RefreshRuntimeModule extends webpack.RuntimeModule {
    constructor() {
      super("Refresh", 5);
    }

    generate() {
      const { runtimeTemplate } = this.compilation;
      const declare = runtimeTemplate.supportsConst() ? "const" : "var";

      return webpack.Template.asString([
        `${webpack.RuntimeGlobals.interceptModuleExecution}.push(${runtimeTemplate.basicFunction("options", [
          `${declare} originalFactory = options.factory;`,
          `options.factory = ${runtimeTemplate.basicFunction("moduleObject, moduleExports, webpackRequire", [
            `${declare} prevRefreshReg = self.$RefreshReg$;`,
            `${declare} prevRefreshSig = self.$RefreshSig$;`,
            `self.$RefreshSig$ = () => self["${NAMESPACE}"].createSignatureFunctionForTransform();`,
            `${declare} reg = ${runtimeTemplate.basicFunction("currentModuleId", [
              "self.$RefreshReg$ = function(type, id) {",
              `self["${NAMESPACE}"].register(type, currentModuleId + ' ' + id);`,
              "};",
            ])}`,
            "reg()",
            "try {",
            webpack.Template.indent("originalFactory.call(this, moduleObject, moduleExports, webpackRequire);"),
            "} finally {",
            webpack.Template.indent("self.$RefreshReg$ = prevRefreshReg;"),
            webpack.Template.indent("self.$RefreshSig$ = prevRefreshSig;"),
            "}",
          ])}`,
        ])})`,
        "",
      ]);
    }
  };

module.exports = createRefreshRuntimeModule;
