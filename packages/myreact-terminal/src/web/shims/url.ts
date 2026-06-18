export const fileURLToPath = (url: string): string => {
  if (url.startsWith("file://")) {
    return url.slice(7);
  }
  return url;
};

export const pathToFileURL = (path: string) => {
  return new URL(`file://${path}`);
};

export default { fileURLToPath, pathToFileURL };
