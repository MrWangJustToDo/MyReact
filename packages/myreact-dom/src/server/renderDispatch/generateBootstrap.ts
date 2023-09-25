import type { BootstrapScriptDescriptor } from "./serverStreamDispatch";

export const generateBootstrap = (options: BootstrapScriptDescriptor | string): string => {
  if (typeof options === "string") {
    return `<script src="${options}"></script>`;
  } else {
    return `<script src="${options.src}" integrity="${options.integrity}" crossorigin="${options.crossOrigin}"></script>`;
  }
};

export const generateModuleBootstrap = (options: BootstrapScriptDescriptor | string): string => {
  if (typeof options === "string") {
    return `<script type="module" src="${options}"></script>`;
  } else {
    return `<script type="module" src="${options.src}" integrity="${options.integrity}" crossorigin="${options.crossOrigin}"></script>`;
  }
};
