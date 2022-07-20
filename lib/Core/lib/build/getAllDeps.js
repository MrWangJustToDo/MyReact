const { getFileContent } = require("./getFileContent");
const { getCommonJSDeps } = require("./getCommonJSDeps");
const createRef = (val) => ({ current: val });

const globalModuleContentCache = createRef({});

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
        let content = "";
        if (fullPath in globalModuleContentCache.current) {
          moduleContentCache.current[fullPath] =
            globalModuleContentCache.current[fullPath];
          content = moduleContentCache.current[fullPath].originalContent;
        } else {
          const fileContent = await getModuleContent(fullPath);
          content = fileContent;
          moduleContentCache.current[fullPath] =
            generateModuleContent(fileContent);
          globalModuleContentCache.current[fullPath] =
            moduleContentCache.current[fullPath];
        }
        return Promise.all(
          getModuleDeps(content, fullPath).map(({ entry, fullPath }) =>
            moduleLoader({ entry, fullPath }, targetOption)
          )
        );
      } else {
        return Promise.resolve();
      }
    }
  };
  return moduleLoader;
};

const _commonJSModuleLoader = generateModuleLoader({
  getModuleContent: getFileContent,
  getModuleDeps: getCommonJSDeps,
  generateModuleContent: (content) => {
    const moduleContent = new Function("require", "module", "exports", content);
    moduleContent.originalContent = content;
    return moduleContent;
  },
});

const commonJSModuleLoader = async (entry) => {
  reset();
  return await _commonJSModuleLoader(entry);
};

const reset = () => {
  moduleNameCache.current = {};
  moduleContentCache.current = {};
};

module.exports.moduleNameCache = moduleNameCache;
module.exports.moduleContentCache = moduleContentCache;
module.exports.commonJSModuleLoader = commonJSModuleLoader;
