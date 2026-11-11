/**
 * React 18 compatibility entry for `@lynx-js/react/compat`.
 *
 * ReactLynx's compat entry is a superset of its root that also provides a
 * default export. MyReact's root exposes the same hooks, so this module keeps
 * the subpath contract for libraries that import it.
 */

import * as React from "@my-react/react";

// eslint-disable-next-line import/no-useless-path-segments -- explicit ESM extension in emitted output
export * from "./background/index.js";

export default React;
