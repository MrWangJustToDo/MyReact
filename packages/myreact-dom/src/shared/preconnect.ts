import { isServer } from "./env";

const urlSet = new Set<string>();

export function preconnect(url: string) {
  if (typeof url !== "string") return;

  if (isServer) {
    urlSet.add(url);
  } else {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = url;
    document.head.appendChild(link);
  }
}

export function getPreConnects() {
  const s = Array.from(urlSet)
    .map((url) => `<link rel="preconnect" href="${url}" />`)
    .join("");

  urlSet.clear();

  return s;
}

export function clearPreConnects() {
  urlSet.clear();
}
