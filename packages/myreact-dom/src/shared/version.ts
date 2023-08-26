import * as react from "@my-react/react";
import * as reconciler from "@my-react/react-reconciler";

export const checkReconcilerVersion = () => {
  if (!reconciler.version || reconciler.version !== __VERSION__) {
    console.error(
      `[@my-react/react-dom] the version of '@my-react/react-reconciler' not match for '@my-react/react-dom', this may cause some bug, try to reinstall the 'node_modules' to fix this error`
    );
  }
};

export const checkMyReactVersion = () => {
  if (!react.version || react.version !== __VERSION__) {
    console.error(
      `[@my-react/react-dom] the version of '@my-react/react' not match for '@my-react/react-dom', this may cause some bug, try to reinstall the 'node_modules' to fix this error`
    );
  }
};
