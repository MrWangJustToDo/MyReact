import { ClientDomDispatch } from "@my-react/react-dom";
import BabelType from "@babel/core";

declare global {
  const __CLIENT__: boolean;
  const __SERVER__: boolean;
  const __CSR__: boolean;
  const __SSR__: boolean;
  const __BUNDLE_SCOPE__: string;
  const __OUTPUT_SCOPE__: string;
  // current application is build by React or not
  const __REACT__: boolean;
  const __DEVELOPMENT__: boolean;
  const __MIDDLEWARE__: boolean;
  const __ANIMATE_ROUTER__: boolean;
  const __BUILD_TIME__: string;

  const __STREAM__: boolean;

  const __BASENAME__: string;

  interface Window {
    __INITIAL_PROPS_SSR__: { [key: string]: any };
    __PRELOAD_STORE_STATE__: { [key: string]: any };
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    __ENV__: {
      LANG: string;
      isSSR: boolean;
      isSTREAM: boolean;
      isSTATIC: boolean;
      isPURE_CSR: boolean;
      isMIDDLEWARE: boolean;
      isDEVELOPMENT: boolean;
      isANIMATE_ROUTER: boolean;
      PUBLIC_API_HOST: string;
      FRAMEWORK: "react" | "myreact";
    };

    __MY_REACT_DEVTOOL_RUNTIME__?: ((dispatch: ClientDomDispatch) => void) & { init: () => void };

    __MY_REACT_DEVTOOL_IFRAME__?: ((origin: string, token?: string) => void) & { close: () => void };

    ["__@my-react/dispatch__"]: ClientDomDispatch[];

    Babel: typeof BabelType;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      DEV_HOST: string;
      DEV_PORT: string;
      WDS_PORT: string;
      PROD_PORT: string;
      STREAM: string;
      SSR: string;
      CSR: string;
      BUNDLE_SCOPE: string;
      OUTPUT_SCOPE: string;
      BASENAME: string;
      REACT: "react" | "myreact";
      STATIC_GENERATE: "true" | "false";
      PUBLIC_DEV_API_HOST: string;
      PUBLIC_PROD_API_HOST: string;
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
    export = classes;
  }

  module "*.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
  }
}

export {};
