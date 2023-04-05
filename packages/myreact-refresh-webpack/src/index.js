const webpack = require("webpack");
const path = require("path");
const { refreshUtils, NAME, matcherOptions, injectRefreshFunctions } = require("./utils/constants");

class ReloadPlugin {
  constructor(options) {
    this.matcher = webpack.ModuleFilenameHelpers.matchObject.bind(undefined, matcherOptions);

    this.options = options;
  }

  webpack5(compiler, RuntimeGlobals) {
    const createRefreshRuntimeModule = require("./utils/runtime");
    const RefreshRuntimeModule = createRefreshRuntimeModule(compiler.webpack ? compiler.webpack : webpack);

    compiler.hooks.compilation.tap(NAME, (compilation, { normalModuleFactory }) => {
      if (compilation.compiler !== compiler) {
        return;
      }

      injectRefreshFunctions(compilation);

      compilation.hooks.additionalTreeRuntimeRequirements.tap(NAME, (chunk, runtimeRequirements) => {
        runtimeRequirements.add(RuntimeGlobals.interceptModuleExecution);
        compilation.addRuntimeModule(chunk, new RefreshRuntimeModule());
      });

      normalModuleFactory.hooks.afterResolve.tap(NAME, ({ createData: data }) => {
        if (
          this.matcher(data.resource) &&
          !data.resource.includes("@my-react") &&
          !data.resource.includes(path.join(__dirname, "./loader")) &&
          !data.resource.includes(path.join(__dirname, "./utils"))
        ) {
          data.loaders.unshift({
            loader: require.resolve("./loader"),
            options: undefined,
          });
        }
      });
    });
  }

  apply(compiler) {
    if (process.env.NODE_ENV === "production" || compiler.options.mode === "production") return;

    const internalWebpackVersion = Number(compiler.webpack ? compiler.webpack.version[0] : 4);
    const externalWebpackVersion = Number(webpack.version[0]);

    if (!externalWebpackVersion) {
      throw new Error(`Missing webpack Dependency, try installing webpack@${compiler.webpack ? compiler.webpack.version : 4} locally.`);
    }

    if (internalWebpackVersion !== externalWebpackVersion) {
      throw new Error(`
        Next is using webpack-version ${internalWebpackVersion} and you have ${externalWebpackVersion} installed.
        Try installing ${compiler.webpack ? compiler.webpack.version : 4} locally.
        Or if you want to try webpack 5 you can turn this on with { future: { webpack5:true } } in you next.config.js.
      `);
    }

    let provide = {
      [refreshUtils]: require.resolve("./utils/refresh"),
    };

    const providePlugin = new webpack.ProvidePlugin(provide);
    providePlugin.apply(compiler);

    switch (Number(webpack.version[0])) {
      case 5: {
        const dependency = webpack.EntryPlugin.createDependency("@my-react/react-refresh", { name: "@my-react/react-refresh" });
        compiler.hooks.make.tapAsync(NAME, (compilation, callback) => {
          compilation.addEntry(compiler.context, dependency, undefined, callback);
        });

        this.webpack5(compiler, compiler.webpack ? compiler.webpack.RuntimeGlobals : webpack.RuntimeGlobals);
        break;
      }
      default: {
        throw new Error("Unsupported webpack version.");
      }
    }
  }
}

module.exports = ReloadPlugin;
