// const { isLikelyComponentType, performReactRefresh } = require("@my-react/react-refresh/runtime");

// eslint-disable-next-line
const getExports = (m) => m.exports || m.__proto__.exports;

function isSafeExport(key) {
  return key === "__esModule" || key === "__N_SSG" || key === "__N_SSP" || key === "__N_RSC" || key === "config";
}

function registerExports(moduleExports, moduleId) {
  self["__@my-react/react-refresh__"].register(moduleExports, moduleId + " %exports%");
  if (moduleExports == null || typeof moduleExports !== "object") return;

  for (const key in moduleExports) {
    if (isSafeExport(key)) continue;
    const exportValue = moduleExports[key];
    const typeID = moduleId + " %exports% " + key;
    self["__@my-react/react-refresh__"].register(exportValue, typeID);
  }
}

const shouldBind = (m) => {
  let isCitizen = false;
  const moduleExports = getExports(m);

  if (self["__@my-react/react-refresh__"].isLikelyComponentType(moduleExports)) {
    isCitizen = true;
  }

  if (moduleExports === undefined || moduleExports === null || typeof moduleExports !== "object") {
    isCitizen = isCitizen || false;
  } else {
    for (const key in moduleExports) {
      if (key === "__esModule") continue;

      const exportValue = moduleExports[key];
      if (self["__@my-react/react-refresh__"].isLikelyComponentType(exportValue)) {
        isCitizen = isCitizen || true;
      }
    }
  }

  return isCitizen;
};

const performReactRefresh = () => {
  self["__@my-react/react-refresh__"].performReactRefresh();
};

module.exports = Object.freeze({
  getExports,
  shouldBind,
  performReactRefresh,
  registerExports,
});
