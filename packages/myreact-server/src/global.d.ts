declare global {
  const __DEV__: boolean;
  const __VERSION__: string;

  interface globalThis {
    __my_react_modules__: Map<string, any>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
