const { promises } = require("fs");
const fastFolderSize = require("fast-folder-size");
const { resolve } = require("path");
const { getLengthByNumber, getRelativePath } = require("./tools");

async function fileState(filePath) {
  return await promises.stat(filePath).then(({ size, mtime }) => ({
    size,
    mtime,
  }));
}

async function dirSize(dirPath) {
  return new Promise((r) => fastFolderSize(dirPath, (_, byte) => r(byte || 0)));
}

async function dirState(dirPath) {
  return Promise.all([dirSize(dirPath), fileState(dirPath)]).then(([size, { mtime }]) => ({ size, mtime }));
}

async function du(baseDir, resolvePath) {
  if (resolvePath.startsWith(baseDir)) {
    let total = 0;
    const children = await promises.readdir(resolvePath, { withFileTypes: true }).then((itemArr) => {
      return Promise.all(
        itemArr.map((item, id) => {
          const absolutePath = resolve(resolvePath, item.name);
          if (item.isFile()) {
            return fileState(absolutePath).then(({ size, mtime }) => {
              total += size;
              return {
                id,
                type: "file",
                relativePath: item.name,
                absolutePath,
                size,
                ["length"]: size,
                ["fileType"]: "file",
                ["modifyTime"]: mtime,
                ["readAbleLength"]: getLengthByNumber(size),
                ["shortPath"]: item.name,
                ["resolvePath"]: absolutePath,
                ["relativePath"]: getRelativePath(baseDir, absolutePath),
              };
            });
          } else if (item.isDirectory()) {
            return dirState(absolutePath).then(({ size, mtime }) => {
              total += size;
              return {
                id,
                type: "dir",
                relativePath: item.name,
                absolutePath,
                size,
                ["length"]: size,
                ["fileType"]: "dir",
                ["modifyTime"]: mtime,
                ["readAbleLength"]: getLengthByNumber(size),
                ["shortPath"]: item.name,
                ["resolvePath"]: absolutePath,
                ["relativePath"]: getRelativePath(baseDir, absolutePath),
              };
            });
          }
        })
      ).then((arr) => arr.filter(Boolean));
    });

    return {
      length: total,
      resolvePath,
      relativePath: getRelativePath(baseDir, resolvePath),
      fileType: "dir",
      files: children,
    };
  }
}

function getFolder(baseDir, resolvePath) {
  return du(baseDir, resolvePath);
}

function getFolderSize(resolvePath) {
  return dirSize(resolvePath);
}

exports.getFolder = getFolder;
exports.getFolderSize = getFolderSize;
