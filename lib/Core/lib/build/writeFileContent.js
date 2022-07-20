const fs = require("fs");

const writeFileContent = async (content, output) =>
  await fs.promises.writeFile(output, content);

module.exports.writeFileContent = writeFileContent;
