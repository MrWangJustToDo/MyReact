import { ChunkExtractor } from "@loadable/server";
import { readFile } from "fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { HTML } from "./template";
import { manifestLoadableFile, manifestStateFile } from "./util";

import type { Request, Response } from "express";

let obj: any = null;

export const generateRender = () => async (_req: Request, res: Response) => {
  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadableFile("client") });

  if (!obj) {
    const stateFilePath = manifestStateFile("client");

    const content = await readFile(stateFilePath, { encoding: "utf-8" });

    obj = JSON.parse(content);
  }

  const refreshElements = [];

  const linkElements = webExtractor.getLinkElements();

  const styleElements = webExtractor.getStyleElements();

  const scriptElements = webExtractor.getScriptElements();

  if (process.env.REACT === "myreact") {
    const refreshScriptPath = obj["__refresh__.js"];

    refreshElements.push(createElement("script", { ["data-refresh"]: "@my-react/react-refresh", src: refreshScriptPath }));
  }

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify({})}
          lang={"en"}
          link={linkElements.concat(styleElements)}
          preloadedState={JSON.stringify({})}
          script={scriptElements}
          refresh={refreshElements}
        />
      )
  );
};
