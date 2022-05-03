const path = require("path");
const regex1 = /require\s*\(\s*(['|"])(.*?)\1\s*\)\s*/g;
const regex2 = /require\s*\(\s*(['|"])(.*?)\1\s*\)\s*/;

const getCommonJSDeps = (content, option, fullPathCache) => {
  const all = content.match(regex1) || [];
  return all.map((moduleName) => {
    const entry = regex2.exec(moduleName)[2];
    const fullPath = path.resolve(option.context, entry);
    fullPathCache[entry] = fullPath;
    return fullPath;
  });
};

module.exports.getCommonJSDeps = getCommonJSDeps;
