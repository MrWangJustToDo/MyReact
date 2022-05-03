const path = require("path");
const { getFileContent } = require("./getFileContent");
const { getCommonJSDeps } = require("./getCommonJSDeps");

const hashCache = Object.create(null);

const fullPathNameCache = Object.create(null);

const moduleNameCache = Object.create(null);

const moduleContentCache = Object.create(null);

const getNewHashKey = () => {
  let key = Math.random().toString(16).slice(2);
  while (key in hashCache) {
    key = Math.random().toString(16).slice(2);
  }

  return key;
};

const generateModuleLoader = (loadOption) => {
  const moduleLoader = async (entry, option) => {
    const targetOption = { ...loadOption, ...option };
    const { getModuleContent, getModuleDeps, generateModuleContent } =
      targetOption;
    if (!(entry in moduleNameCache)) {
      moduleNameCache[entry] = getNewHashKey();
      const content = await getModuleContent(entry);
      moduleContentCache[moduleNameCache[entry]] =
        generateModuleContent(content);
      return Promise.all(
        getModuleDeps(content, targetOption, fullPathNameCache).map(
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

module.exports.moduleNameCache = moduleNameCache;
module.exports.fullPathNameCache = fullPathNameCache;
module.exports.moduleContentCache = moduleContentCache;
module.exports.commonJSModuleLoader = commonJSModuleLoader;
