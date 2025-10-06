import { isServer } from "./env";

const urlSet = new Set<string>();

export const prefetchDNS = (url: string) => {
  if (typeof url !== "string") return;

  if (isServer) {
    urlSet.add(url);
  } else {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = url;
    document.head.appendChild(link);
  }
};

export const getPrefetchDNS = () => {
  const s = Array.from(urlSet)
    .map((url) => `<link rel="dns-prefetch" href="${url}" />`)
    .join("");

  urlSet.clear();

  return s;
};

export const clearPrefetchDNS = () => {
  urlSet.clear();
};
