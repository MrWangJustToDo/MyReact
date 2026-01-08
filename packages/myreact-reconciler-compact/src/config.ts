import { createRef } from "@my-react/react";

export const enableKnownConfigLog = createRef(false);

const knownConfigKeys = [
  "prepareForCommit",
  "resetAfterCommit",
  "appendChildToContainer",
  "appendInitialChild",
  "appendChild",
  "shouldSetTextContent",
  "createTextInstance",
  "createInstance",
  "preparePortalMount",
  "insertInContainerBefore",
  "insertBefore",
  "getPublicInstance",
  "removeChildFromContainer",
  "removeChild",
  "commitTextUpdate",
  "prepareUpdate",
  "commitUpdate",
  "getRootHostContext",
  "getChildHostContext",
  "finalizeInitialChildren",
  "commitMount",
];

export const knownConfig = (config: any) => {
  Object.keys(config).forEach((key) => {
    if (!knownConfigKeys.includes(key)) {
      console.warn(`not used config key ${key} with %o value`, config[key]);
    }
  });
};
