import { createSignatureFunctionForTransform, register } from "@my-react/react-refresh/runtime";
import { executeRuntime, getModuleExports } from "./refreshUtils.js";

function refresh(moduleId, hot) {
  const currentExports = getModuleExports(moduleId);
  const runRefresh = (moduleExports) => {
    const testMode = typeof __react_refresh_test__ !== "undefined" ? __react_refresh_test__ : undefined;
    executeRuntime(moduleExports, moduleId, hot, testMode);
  };
  if (typeof Promise !== "undefined" && currentExports instanceof Promise) {
    currentExports.then(runRefresh);
  } else {
    runRefresh(currentExports);
  }
}

export { createSignatureFunctionForTransform, refresh, register };
