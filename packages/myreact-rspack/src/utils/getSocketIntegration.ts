export type IntegrationType = "wds" | "whm" | (string & {});

export function getSocketIntegration(integrationType: IntegrationType) {
  let resolvedSocketIntegration: string;
  switch (integrationType) {
    case "wds": {
      resolvedSocketIntegration = require.resolve("../sockets/WDSSocket");
      break;
    }
    case "whm": {
      resolvedSocketIntegration = require.resolve("../sockets/WHMEventSource");
      break;
    }
    default: {
      resolvedSocketIntegration = require.resolve(integrationType);
      break;
    }
  }

  return resolvedSocketIntegration;
}
