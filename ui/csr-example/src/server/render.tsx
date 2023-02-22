import { ChunkExtractor } from "@loadable/server";
import { renderToString } from "react-dom/server";

import { HTML } from "./template";
import { manifestLoadableFile } from "./util";

import type { Request, Response } from "express";

export const generateRender = () => (_req: Request, res: Response) => {
  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadableFile("client") });

  const linkElements = webExtractor.getLinkElements();

  const styleElements = webExtractor.getStyleElements();

  const scriptElements = webExtractor.getScriptElements();

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify({})}
          lang={JSON.stringify("en")}
          link={linkElements.concat(styleElements)}
          preloadedState={JSON.stringify({})}
          script={scriptElements}
        />
      )
  );
};
