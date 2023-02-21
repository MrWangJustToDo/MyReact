import { createElement } from "react";

type GenerateType = string | { path?: string; [p: string]: string };

export const generateStyleElements = (paths: GenerateType[]) => {
  return paths.map((s, i) =>
    typeof s === "string"
      ? createElement("link", { key: i, href: s, rel: "stylesheet" })
      : s.path
      ? createElement("link", {
          key: i,
          href: s.path,
          rel: "stylesheet",
          ...Object.keys(s)
            .filter((k) => k !== "path")
            .reduce((p, k) => ((p[k] = s[k]), p), {}),
        })
      : null
  );
};
export const generateScriptElements = (paths: GenerateType[]) =>
  paths.map((s, i) =>
    typeof s === "string"
      ? createElement("script", { key: i, src: s, async: true })
      : createElement("script", {
          key: i,
          src: s.path,
          ...Object.keys(s)
            .filter((k) => k !== "path")
            .reduce((p, k) => ((p[k] = s[k]), p), {}),
        })
  );

export const generatePreloadScriptElements = (paths: GenerateType[]) =>
  paths.map((s, i) =>
    typeof s === "string"
      ? createElement("link", { key: i, rel: "preload", as: "script", href: s })
      : s.path
      ? createElement("link", {
          key: i,
          rel: "preload",
          as: "script",
          href: s.path,
        })
      : null
  );
