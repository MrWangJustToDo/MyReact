const path = require("path");
const {
  commonJSModuleLoader,
  moduleContentCache,
  moduleNameCache,
} = require("./getAllDeps");
const { writeFileContent } = require("./writeFileContent");

const stringify = (obj) => {
  let re = "{";
  for (let key in obj) {
    re += "'" + key + "':";
    if (typeof obj[key] == "function") {
      re += obj[key].toString() + ",\n";
    } else {
      re += '"' + obj[key] + '"' + ", \n";
    }
  }
  re += "}";
  return re;
};

const commonJSBootStrap = async (entry, output) => {
  const context = path.dirname(entry);
  const fullPath = path.resolve(context, entry);
  await commonJSModuleLoader({ entry, fullPath }).then(() => {
    const content = `
var allModuleName = {...allModuleName, ...${stringify(
      moduleNameCache.current
    )}};
var allModuleContent = {...allModuleContent, ...${stringify(
      moduleContentCache.current
    )}};
var cache = cache || {};
function require(entry) {
  const fullModulePath = allModuleName[entry] || entry;
  if (!(fullModulePath in cache)) {
    const module = {exports: {}};
    cache[fullModulePath] = module;
    allModuleContent[fullModulePath](require, module, module.exports)
  }
  return cache[fullModulePath].exports;
}
// start 
require('${entry}')
    `;
    return writeFileContent(content, output);
  });
};

module.exports.commonJSBootStrap = commonJSBootStrap;
