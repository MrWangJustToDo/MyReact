import type { Middleware } from "../compose";

export const initHeader: Middleware = (next) => async (args) => {
  // const { res } = args;

  // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  // res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  await next(args);
};
