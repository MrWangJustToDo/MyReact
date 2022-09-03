declare global {
  const __CLIENT__: boolean;
  const __SERVER__: boolean;
  const __CSR__: boolean;
  const __SSR__: boolean;
  const __DEVELOPMENT__: boolean;
  const __MIDDLEWARE__: boolean;
  const __ANIMATE_ROUTER__: boolean;
  const __BUILD_TIME__: string;
  const __UI__: "material" | "antd" | "chakra";

  interface Window {
    __cache: unknown;
    __request: unknown;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    __INITIAL_PROPS_SSR__: { [key: string]: any };
    __PRELOAD_STORE_STATE__: { [key: string]: any };
    __ENV__: {
      LANG: string;
      isSSR: boolean;
      CRYPTO_KEY: string;
      PUBLIC_API_HOST: string;
      isMIDDLEWARE: boolean;
      isDEVELOPMENT: boolean;
      isANIMATE_ROUTER: boolean;
      UI: "antd" | "material" | "chakra";
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      DEV_HOST: string;
      DEV_PORT: string;
      WDS_PORT: string;
      PROD_PORT: string;
      SSR: string;
      UI: "antd" | "material" | "chakra";
      PUBLIC_API_HOST: string;
      CRYPTO_KEY: string;
      SERVER_ENTRY: string;
      CLIENT_ENTRY: string;
      MIDDLEWARE: string;
      ANIMATE_ROUTER: string;
    }
  }

  module "*.bmp" {
    const src: string;
    export default src;
  }

  module "*.gif" {
    const src: string;
    export default src;
  }

  module "*.jpg" {
    const src: string;
    export default src;
  }

  module "*.jpeg" {
    const src: string;
    export default src;
  }

  module "*.png" {
    const src: string;
    export default src;
  }

  module "*.webp" {
    const src: string;
    export default src;
  }

  module "*.module.css" {
    const css: { readonly [key: string]: string };
    export default css;
  }

  module "*.css" {
    const css: { readonly [key: string]: string };
    export default css;
  }

  module "*.module.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
  }

  module "*.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
  }
}

export {};
