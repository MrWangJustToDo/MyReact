const { getFileContent } = require("./getFileContent");
const { getCommonJSDeps } = require("./getCommonJSDeps");
const createRef = (val) => ({ current: val });

const moduleNameCache = createRef({});

const moduleContentCache = createRef({});

const generateModuleLoader = (loadOption) => {
  const moduleLoader = async ({ entry, fullPath }, option) => {
    const targetOption = { ...loadOption, ...option };
    const { getModuleContent, getModuleDeps, generateModuleContent } =
      targetOption;
    if (!(entry in moduleNameCache.current)) {
      moduleNameCache.current[entry] = fullPath;
      if (!(fullPath in moduleContentCache.current)) {
        const content = await getModuleContent(fullPath);
        moduleContentCache.current[fullPath] = generateModuleContent(content);
        return Promise.all(
          getModuleDeps(content, fullPath).map(({ entry, fullPath }) =>
            moduleLoader({ entry, fullPath }, targetOption)
          )
        );
      } else {
        return Promise.resolve();
      }
    } else {
      // if (!(fullPath in moduleContentCache.current)) {
      //   console.log(
      //     "0----",
      //     moduleNameCache.current[entry],
      //     moduleContentCache.current[fullPath]
      //   );
      //   throw new Error("module build error");
      // }
    }
  };
  return moduleLoader;
};

const _commonJSModuleLoader = generateModuleLoader({
  getModuleContent: getFileContent,
  getModuleDeps: getCommonJSDeps,
  generateModuleContent: (content) =>
    new Function("require", "module", "exports", content),
});

const commonJSModuleLoader = async (entry) => {
  return await _commonJSModuleLoader(entry);
};

module.exports.moduleNameCache = moduleNameCache;
module.exports.moduleContentCache = moduleContentCache;
module.exports.commonJSModuleLoader = commonJSModuleLoader;
