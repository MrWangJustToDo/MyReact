import type { IntegrationType } from './getSocketIntegration';

/**
 * Gets entry point of a supported socket integration.
 * @param integrationType A valid socket integration type or a path to a module.
 * @returns Path to the resolved integration entry point.
 */
export function getIntegrationEntry(integrationType: IntegrationType) {
  let resolvedEntry: string | undefined;
  switch (integrationType) {
    case 'whm': {
      resolvedEntry = 'webpack-hot-middleware/client';
      break;
    }
  }

  return resolvedEntry;
}