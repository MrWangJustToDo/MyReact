declare global {
  const __DEV__: boolean;
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_TOKEN: string;
    }
  }
}

export {};
