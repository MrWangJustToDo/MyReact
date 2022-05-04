const path = require("path");
const {
  commonJSModuleLoader,
  moduleContentCache,
  moduleNameCache,
  fullPathNameCache,
  getNewHashKey,
  reset,
} = require("./getAllDeps");
const { writeFileContent } = require("./writeFileContent");

function stringify(obj) {
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
}

const commonJSBootStrap = async (entry, output) => {
  reset();
  const entryHash = getNewHashKey();
  await commonJSModuleLoader(entry).then(() => {
    const context = path.dirname(entry);
    const fullEntry = path.resolve(context, entry);
    const content = `
const appEntry_${entryHash} = '${fullEntry}';
var allModuleName = {...allModuleName, ...${stringify(
      moduleNameCache.current
    )}};
var allModuleContent = {...allModuleContent, ...${stringify(
      moduleContentCache.current
    )}};
var fullPathToModuleId = {...fullPathToModuleId, ...${stringify(
      fullPathNameCache.current
    )}};
var cache = cache || {};
function require(entry) {
  const targetEntry = fullPathToModuleId[entry] || entry;
  const hashId = allModuleName[targetEntry];
  if (!(hashId in cache)) {
    const module = {exports: {}};
    cache[hashId] = module;
    allModuleContent[hashId](require, module, module.exports)
  }
  return cache[hashId].exports;
}
// start 
require(appEntry_${entryHash})
    `;
    return writeFileContent(content, output);
  });
};

module.exports.commonJSBootStrap = commonJSBootStrap;
