const isBrowser = typeof window !== "undefined";

const side = isBrowser ? "client" : "server";

export const log = (message: string | Error, lev: "normal" | "warn" | "error") => {
  if (lev === "error") {
    if (message instanceof Error) {
      console.log(`[${side}]`, `[error]`, message.stack);
    } else {
      console.log(`[${side}]`, `[error]`, message.toString());
    }
  } else if (lev === "warn") {
    console.log(`[${side}]`, `[warn]`, message.toString());
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${side}]`, `[normal]`, message.toString());
    }
  }
};
