import { createReadStream, createWriteStream } from "fs";
import { resolve } from "path";

const copyContent = (sourceFile: string, targetFile: string) => {
  return new Promise<void>((r) => {
    const readStream = createReadStream(sourceFile);
    const writeStream = createWriteStream(targetFile);
    readStream.pipe(writeStream);
    readStream.on("end", () => r());
    readStream.on("error", () => r());
  });
};

let myReactPending = false;

export const copyMyReact = async () => {
  if (myReactPending) return;
  myReactPending = true;

  return Promise.all([
    copyContent(
      resolve(process.cwd(), "packages", "myreact", "dist/umd/index.development.js"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact.js")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact", "dist/umd/index.development.js"),
      resolve(process.cwd(), "packages", "csr-example", "public/lib/myreact.js")
    ),
  ]).then(() => {
    myReactPending = false;
  });
};

let myReactDOMPending = false;

export const copyMyReactDOM = () => {
  if (myReactDOMPending) return;
  myReactDOMPending = true;

  return Promise.all([
    copyContent(
      resolve(process.cwd(), "packages", "myreact-dom", "dist/umd/index.development.js"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact-dom.js")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact-dom", "dist/umd/index.development.js"),
      resolve(process.cwd(), "packages", "csr-example", "public/lib/myreact-dom.js")
    ),
  ]).then(() => {
    myReactDOMPending = false;
  });
};
