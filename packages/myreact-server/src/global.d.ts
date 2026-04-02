declare global {
  const __DEV__: boolean;
  const __VERSION__: string;

  interface globalThis {
    __my_react_modules__: Map<string, any>;
    __MY_REACT_CALL_SERVER__?: (actionId: string, args: unknown[]) => Promise<unknown>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
