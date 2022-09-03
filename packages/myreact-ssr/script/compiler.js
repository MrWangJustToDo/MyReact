const chalk = require("chalk");
const { Compiler } = require("webpack");
const { dynamicCache, DynamicRouter } = require("./dynamic");

/**
 *
 * @param {'client' | 'server'} name
 * @param {Compiler} compiler
 * @param {{dynamicRouter: boolean, development: boolean}} compilerConfig
 * @returns {Promise<void>}
 */
const compilerPromise = (name, compiler, compilerConfig = {}) => {
  let count = 0;
  let dynamicCount = 0;
  const dynamicRouter = compilerConfig.dynamicRouter ?? false;
  const development = compilerConfig.development ?? true;
  const dynamicFactory = new DynamicRouter(dynamicCache, name);
  if (development && dynamicRouter) {
    console.log(`[${name}]`, chalk.redBright("Dynamic Router enabled!, now you can create a new page under the pages folder for fast refresh"));
  }
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => console.log(`[${name}]`, chalk.blue(`Compiling`)));
    if (dynamicRouter) {
      compiler.hooks.beforeCompile.tapPromise("beforeCompile", () => {
        if (dynamicCount === count) {
          dynamicCount++;
          return dynamicFactory.getDynamicRouter();
        } else {
          return Promise.resolve();
        }
      });
    }
    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        development
          ? console.log(`[${name}]`, chalk.blue(`compiler done, compiler count: ${count++}`), `-- time: ${stats.endTime - stats.startTime} ms`)
          : console.log(`[${name}]`, chalk.blue("production code compiler done"), `-- time: ${stats.endTime - stats.startTime} ms`);
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};

exports.compilerPromise = compilerPromise;
