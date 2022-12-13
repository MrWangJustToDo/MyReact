import { createReadStream, createWriteStream } from "fs";
import { resolve } from "path";

const copyContent = (sourceFile: string, targetFile: string) => {
  return new Promise<void>((r) => {
    const readStream = createReadStream(sourceFile);
    const writeStream = createWriteStream(targetFile);
    readStream.pipe(writeStream);
    readStream.on("close", () => r());
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
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact/index.development.js")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact", "dist/umd/index.production.js"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact/index.production.js")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact", "dist/umd/index.development.js.map"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact/index.development.js.map")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact", "dist/umd/index.production.js.map"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact/index.production.js.map")
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
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact-dom/index.development.js")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact-dom", "dist/umd/index.production.js"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact-dom/index.production.js")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact-dom", "dist/umd/index.development.js.map"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact-dom/index.development.js.map")
    ),
    copyContent(
      resolve(process.cwd(), "packages", "myreact-dom", "dist/umd/index.production.js.map"),
      resolve(process.cwd(), "packages", "ssr-example", "public/myreact-dom/index.production.js.map")
    ),
  ]).then(() => {
    myReactDOMPending = false;
  });
};
