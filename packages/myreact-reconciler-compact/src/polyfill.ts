/* eslint-disable @typescript-eslint/no-require-imports */
export const loadScript = (url: string) => {
  if (typeof window !== "undefined") {
    return new Promise<void>((resolve, reject) => {
      if (typeof document === "undefined") {
        reject(new Error("[@my-react-devtool/polyfill] document not found, current environment not support"));

        return;
      }

      const script = document.createElement("script");

      script.src = url;

      script.onload = () => resolve();

      script.onerror = reject;

      document.body.appendChild(script);
    });
  } else if (typeof process !== "undefined" && typeof require === "function") {
    return new Promise<void>((resolve, reject) => {
      const loadPkg = async () => {
        const http = await import("http");
        const https = await import("https");
        const vm = await import("vm");

        const protocol = url.startsWith("https") ? https : http;

        protocol
          .get(url, (res: any) => {
            let data = "";
            res.on("data", (chunk: any) => {
              data += chunk;
            });
            res.on("end", () => {
              try {
                vm.runInThisContext(data);
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          })
          .on("error", (error: Error) => {
            reject(error);
          });
      };

      loadPkg();
    });
  }
};
