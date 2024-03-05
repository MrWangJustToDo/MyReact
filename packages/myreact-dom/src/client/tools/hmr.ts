import { __my_react_shared__ } from "@my-react/react";
import { initHMR } from "@my-react/react-reconciler";

import { isServer } from "@my-react-dom-shared";

const { enableHMRForDev } = __my_react_shared__;

const HMR_FIELD = "__@my-react/hmr__";

/**
 * @internal
 */
export const initGlobalHMR = () => {
  if (__DEV__ && !isServer && enableHMRForDev.current) {
    if (globalThis[HMR_FIELD]) {
      console.error(
        `[@my-react/react-dom] current environment already have a HMR runtime, maybe current environment have multiple version of '@my-react/react-dom'`
      );
    } else {
      globalThis[HMR_FIELD] = {};

      try {
        initHMR(globalThis[HMR_FIELD]);
      } catch (e) {
        if (__DEV__) {
          console.error(`[@my-react/react-dom] initHMR failed, error: ${(e as Error).message}`);
        }
      }
    }
  }
};
