import { isServer } from "./env";

const map = new Map<string, string[]>();

export const preload = (
  url: string,
  options: { as: "style" | "script" | "audio" | "document" | "embed" | "fetch" | "font" | "image" | "object" | "track" | "video" | "worker" }
) => {
  if (typeof url !== "string") return;
  if (typeof options !== "object" || !options.as) return;

  if (isServer) {
    const exist = map.get(options.as) || [];
    if (!exist.includes(url)) {
      exist.push(url);
    }
    map.set(options.as, exist);
  } else {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = options.as;
    link.href = url;
    document.head.appendChild(link);
  }
};

export const preloadModule = (_url: string) => void 0;

export const getPreloads = () => {
  let result = "";
  map.forEach((urls, as) => {
    result += urls.map((url) => `<link rel="preload" href="${url}" as="${as}" />`).join("");
  });
  map.clear();
  return result;
};

export const clearPreloads = () => {
  map.clear();
};
