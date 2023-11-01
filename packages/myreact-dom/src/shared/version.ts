import { version as ReactVersion, __my_react_shared__ } from "@my-react/react";
import { version as ReconcilerVersion } from "@my-react/react-reconciler";

const { enableMockReact } = __my_react_shared__;

export const checkReconcilerVersion = () => {
  if (__DEV__ && (!ReconcilerVersion || ReconcilerVersion !== __VERSION__)) {
    console.error(
      `[@my-react/react-dom] the version of '@my-react/react-reconciler' not match for '@my-react/react-dom', this may cause some bug, try to reinstall the 'node_modules' to fix this error`
    );
  }
};

export const checkMyReactVersion = () => {
  if (!ReactVersion || ReactVersion !== (enableMockReact.current ? "18.2.0" : __VERSION__)) {
    console.error(
      `[@my-react/react-dom] the version of '@my-react/react' not match for '@my-react/react-dom', this may cause some bug, try to reinstall the 'node_modules' to fix this error`
    );
  }
};
