import { __my_react_shared__ } from "@my-react/react";
import { initHMR } from "@my-react/react-reconciler";

import { isServer } from "@my-react-dom-shared";

const { enableHMRForDev } = __my_react_shared__;

export const initGlobalHMR = () => {
  if (__DEV__ && !isServer && enableHMRForDev.current) {
    if (globalThis["__@my-react/hmr__"]) {
      console.error(`[@my-react/react-dom] current environment already have a HMR runtime, maybe current environment have multiple version of '@my-react/react-dom'`);
    } else {
      globalThis["__@my-react/hmr__"] = {};

      try {
        initHMR(globalThis["__@my-react/hmr__"]);
      } catch (e) {
        if (__DEV__) {
          console.error(`[@my-react/react-dom] initHMR failed, error: ${(e as Error).message}`);
        }
      }
    }
  }
};
