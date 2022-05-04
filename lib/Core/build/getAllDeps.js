const path = require("path");
const { getFileContent } = require("./getFileContent");
const { getCommonJSDeps } = require("./getCommonJSDeps");
const createRef = (val) => ({ current: val });

const hashCache = createRef({});

const fullPathNameCache = createRef({});

const moduleNameCache = createRef({});

const moduleContentCache = createRef({});

const getNewHashKey = () => {
  let key = Math.random().toString(16).slice(2);
  while (key in hashCache.current) {
    key = Math.random().toString(16).slice(2);
  }

  return key;
};

const generateModuleLoader = (loadOption) => {
  const moduleLoader = async (entry, option) => {
    const targetOption = { ...loadOption, ...option };
    const { getModuleContent, getModuleDeps, generateModuleContent } =
      targetOption;
    if (!(entry in moduleNameCache.current)) {
      moduleNameCache.current[entry] = getNewHashKey();
      const content = await getModuleContent(entry);
      moduleContentCache.current[moduleNameCache.current[entry]] =
        generateModuleContent(content);
      return Promise.all(
        getModuleDeps(content, targetOption, fullPathNameCache.current).map(
          (moduleName) => moduleLoader(moduleName, targetOption)
        )
      );
    } else {
      return Promise.resolve();
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
  const context = path.dirname(entry);
  return await _commonJSModuleLoader(path.resolve(context, entry), { context });
};

const reset = () => {
  fullPathNameCache.current = {};
  moduleNameCache.current = {};
  moduleContentCache.current = {};
};

module.exports.reset = reset;
module.exports.getNewHashKey = getNewHashKey;
module.exports.moduleNameCache = moduleNameCache;
module.exports.fullPathNameCache = fullPathNameCache;
module.exports.moduleContentCache = moduleContentCache;
module.exports.commonJSModuleLoader = commonJSModuleLoader;
