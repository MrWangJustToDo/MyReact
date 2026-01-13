import path from 'node:path';

export type IntegrationType = 'wds' | 'whm' | (string & {});

export function getSocketIntegration(integrationType: IntegrationType) {
  let resolvedSocketIntegration: string;
  switch (integrationType) {
    case 'wds': {
      resolvedSocketIntegration = path.join(
        __dirname,
        './sockets/WDSSocket.js',
      );
      break;
    }
    case 'whm': {
      resolvedSocketIntegration = path.join(
        __dirname,
        './sockets/WHMEventSource.js',
      );
      break;
    }
    default: {
      resolvedSocketIntegration = require.resolve(integrationType);
      break;
    }
  }

  return resolvedSocketIntegration;
}