import { isServer } from "./env";

const styleSet = new Set<string>();
const scriptSet = new Set<string>();

export const preinit = (url: string, options: { as: "style" | "script" }) => {
  if (typeof url !== "string") return;

  if (options.as === "style") {
    if (isServer) {
      styleSet.add(url);
    } else {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = url;
      document.head.appendChild(link);
    }
  } else if (options.as === "script") {
    if (isServer) {
      scriptSet.add(url);
    } else {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "script";
      link.href = url;
      document.head.appendChild(link);
    }
  }
};

export const preinitModule = (_url: string) => void 0;

export const getPreInits = () => {
  const styles = Array.from(styleSet)
    .map((url) => `<link rel="preload" href="${url}" as="style" />`)
    .join("");
  const scripts = Array.from(scriptSet)
    .map((url) => `<link rel="preload" href="${url}" as="script" />`)
    .join("");

  styleSet.clear();
  scriptSet.clear();

  return styles + scripts;
};

export const clearPreInits = () => {
  styleSet.clear();
  scriptSet.clear();
};
