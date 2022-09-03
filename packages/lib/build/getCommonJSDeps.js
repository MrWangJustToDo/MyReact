const path = require("path");
const regex1 = /require\s*\(\s*(['|"])(.*?)\1\s*\)\s*/g;
const regex2 = /require\s*\(\s*(['|"])(.*?)\1\s*\)\s*/;

const getCommonJSDeps = (content, fullPath) => {
  const all = content.match(regex1) || [];
  const dirname = path.dirname(fullPath);
  return all.map((moduleName) => {
    const entry = regex2.exec(moduleName)[2];
    const fullPath = path.resolve(dirname, entry);
    return { entry, fullPath };
  });
};

module.exports.getCommonJSDeps = getCommonJSDeps;
