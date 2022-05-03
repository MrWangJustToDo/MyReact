const fs = require("fs");

const getFileContent = async (filePath) => {
  return await fs.promises.readFile(fs.realpathSync(filePath), {
    encoding: "utf-8",
  });
};

module.exports.getFileContent = getFileContent;
