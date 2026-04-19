/// <reference types="vite/client" />

// Virtual modules from RSC plugin
declare module "virtual:my-react-rsc/client-registry" {
  // This module has no exports - it just registers client components
}

declare module "virtual:my-react-rsc/server-actions-init" {
  // This module has no exports - it just imports server action modules to register them
}

declare module "virtual:my-react-rsc/client-references" {
  const references: Record<string, unknown>;
  export default references;
}
