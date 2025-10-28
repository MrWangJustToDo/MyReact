declare global {
  const __DEV__: boolean;
  const __VERSION__: string;

  const scheduler: any;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
    }
  }

  interface Window {
    __MY_REACT_DEVTOOL_RUNTIME__: any;
    ["__@my-react/react-devtool-inject__"]: any;
  }
}

export {};
