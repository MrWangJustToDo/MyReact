/**
 * @file RSC Virtual Modules Plugin
 * Provides virtual modules for client references and assets manifest
 */

import type { RscPluginManager } from "../manager";
import type { Plugin } from "vite";

/**
 * Virtual module IDs
 */
export const VIRTUAL_CLIENT_REFERENCES = "virtual:my-react-rsc/client-references";
export const VIRTUAL_CLIENT_REFERENCES_GROUP = "virtual:my-react-rsc/client-references/group/";
export const VIRTUAL_CLIENT_REGISTRY = "virtual:my-react-rsc/client-registry";
export const VIRTUAL_SERVER_ACTIONS_INIT = "virtual:my-react-rsc/server-actions-init";
export const VIRTUAL_ASSETS_MANIFEST = "virtual:my-react-rsc/assets-manifest";
export const VIRTUAL_SERVER_REFERENCES = "virtual:my-react-rsc/server-references";
export const VIRTUAL_ENTRY_BROWSER = "virtual:my-react-rsc/entry-browser";

/**
 * Resolved virtual module prefix
 */
const RESOLVED_PREFIX = "\0";

/**
 * Create the virtual modules plugin
 *
 * Provides these virtual modules:
 * - virtual:my-react-rsc/client-references - Entry importing all client components
 * - virtual:my-react-rsc/client-references/group/{name} - Grouped client components
 * - virtual:my-react-rsc/assets-manifest - Client asset manifest for SSR
 * - virtual:my-react-rsc/server-references - Server action references
 */
export function createVirtualModulesPlugin(manager: RscPluginManager): Plugin {
  return {
    name: "vite:my-react-rsc-virtual-modules",
    enforce: "pre",

    resolveId(source) {
      // Client references entry
      if (source === VIRTUAL_CLIENT_REFERENCES) {
        return RESOLVED_PREFIX + VIRTUAL_CLIENT_REFERENCES;
      }

      // Client reference groups
      if (source.startsWith(VIRTUAL_CLIENT_REFERENCES_GROUP)) {
        return RESOLVED_PREFIX + source;
      }

      // Client registry - registers all client components
      if (source === VIRTUAL_CLIENT_REGISTRY) {
        return RESOLVED_PREFIX + VIRTUAL_CLIENT_REGISTRY;
      }

      // Server actions init - imports all server action modules to register them
      if (source === VIRTUAL_SERVER_ACTIONS_INIT) {
        return RESOLVED_PREFIX + VIRTUAL_SERVER_ACTIONS_INIT;
      }

      // Assets manifest
      if (source === VIRTUAL_ASSETS_MANIFEST) {
        // In build mode, mark as external to be replaced by actual manifest file
        if (this.environment?.mode === "build") {
          return { id: source, external: true };
        }
        return RESOLVED_PREFIX + VIRTUAL_ASSETS_MANIFEST;
      }

      // Server references
      if (source === VIRTUAL_SERVER_REFERENCES) {
        return RESOLVED_PREFIX + VIRTUAL_SERVER_REFERENCES;
      }

      // Browser entry wrapper
      if (source === VIRTUAL_ENTRY_BROWSER) {
        return RESOLVED_PREFIX + VIRTUAL_ENTRY_BROWSER;
      }

      return null;
    },

    load(id) {
      // Client references - imports all client modules
      if (id === RESOLVED_PREFIX + VIRTUAL_CLIENT_REFERENCES) {
        return generateClientReferencesModule(manager);
      }

      // Client reference group
      if (id.startsWith(RESOLVED_PREFIX + VIRTUAL_CLIENT_REFERENCES_GROUP)) {
        const groupName = id.slice((RESOLVED_PREFIX + VIRTUAL_CLIENT_REFERENCES_GROUP).length);
        return generateClientReferenceGroupModule(manager, groupName);
      }

      // Client registry - imports and registers all client modules
      if (id === RESOLVED_PREFIX + VIRTUAL_CLIENT_REGISTRY) {
        return generateClientRegistryModule(manager);
      }

      // Server actions init - imports all server action modules
      if (id === RESOLVED_PREFIX + VIRTUAL_SERVER_ACTIONS_INIT) {
        return generateServerActionsInitModule(manager);
      }

      // Assets manifest (dev mode)
      if (id === RESOLVED_PREFIX + VIRTUAL_ASSETS_MANIFEST) {
        return generateAssetsManifestModule(manager, this.environment?.name);
      }

      // Server references
      if (id === RESOLVED_PREFIX + VIRTUAL_SERVER_REFERENCES) {
        return generateServerReferencesModule(manager);
      }

      // Browser entry
      if (id === RESOLVED_PREFIX + VIRTUAL_ENTRY_BROWSER) {
        return generateBrowserEntryModule(manager);
      }

      return null;
    },

    // During client build, emit the assets manifest
    generateBundle(_, bundle) {
      if (this.environment?.name !== "client") return;

      // Store bundle for manifest generation
      manager.bundles[this.environment.name] = bundle;

      // Generate assets manifest
      manager.buildAssetsManifest = generateBuildAssetsManifest(manager, bundle);
    },
  };
}

/**
 * Generate the client references module
 * This imports all discovered client component modules
 */
function generateClientReferencesModule(manager: RscPluginManager): string {
  const imports: string[] = [];
  const exports: string[] = [];

  let index = 0;
  for (const [moduleId, meta] of Object.entries(manager.clientReferenceMetaMap)) {
    const varName = `_client_${index}`;
    imports.push(`import * as ${varName} from ${JSON.stringify(moduleId)};`);
    exports.push(`  ${JSON.stringify(meta.referenceKey)}: ${varName},`);
    index++;
  }

  if (imports.length === 0) {
    return "export default {};";
  }

  return `${imports.join("\n")}

export default {
${exports.join("\n")}
};`;
}

/**
 * Generate the server actions init module
 * This imports all server action modules to register them with registerServerReference
 * Import this module on the server BEFORE handling any server actions
 */
function generateServerActionsInitModule(manager: RscPluginManager): string {
  const imports: string[] = [];

  // Get unique module IDs from server references
  const moduleIds = new Set<string>();
  for (const moduleId of Object.keys(manager.serverReferenceMetaMap)) {
    moduleIds.add(moduleId);
  }

  for (const moduleId of moduleIds) {
    imports.push(`import ${JSON.stringify(moduleId)};`);
  }

  if (imports.length === 0) {
    return `// No server actions to initialize
export {};`;
  }

  return `// Import all server action modules to register them
${imports.join("\n")}

export {};`;
}

/**
 * Generate the client registry module
 * This imports all client components and registers them with their source paths
 * Import this module before hydration to make client components available
 */
function generateClientRegistryModule(manager: RscPluginManager): string {
  const imports: string[] = [];
  const registers: string[] = [];

  // Import registerModule from the client module loader
  imports.push(`import { registerModule } from "@my-react/react-server/client";`);

  let index = 0;
  for (const [moduleId] of Object.entries(manager.clientReferenceMetaMap)) {
    const varName = `_client_${index}`;
    imports.push(`import * as ${varName} from ${JSON.stringify(moduleId)};`);
    registers.push(`registerModule(${JSON.stringify(moduleId)}, ${varName});`);
    index++;
  }

  if (registers.length === 0) {
    return `// No client components to register
export {};`;
  }

  return `${imports.join("\n")}

// Register all client components with their source paths
${registers.join("\n")}

export {};`;
}

/**
 * Generate a client reference group module
 */
function generateClientReferenceGroupModule(manager: RscPluginManager, groupName: string): string {
  const group = manager.clientReferenceGroups[groupName];

  if (!group || group.length === 0) {
    return "export default {};";
  }

  const imports: string[] = [];
  const exports: string[] = [];

  let index = 0;
  for (const meta of group) {
    const varName = `_client_${index}`;
    imports.push(`import * as ${varName} from ${JSON.stringify(meta.importId)};`);
    exports.push(`  ${JSON.stringify(meta.referenceKey)}: ${varName},`);
    index++;
  }

  return `${imports.join("\n")}

export default {
${exports.join("\n")}
};`;
}

/**
 * Generate the assets manifest module for dev mode
 */
function generateAssetsManifestModule(_manager: RscPluginManager, _envName?: string): string {
  // In dev mode, provide a minimal manifest
  const manifest = {
    bootstrapScriptContent: "",
    clientReferenceDeps: {},
    cssLinkPrecedence: true,
  };

  return `export default ${JSON.stringify(manifest, null, 2)};`;
}

/**
 * Generate the server references module
 */
function generateServerReferencesModule(manager: RscPluginManager): string {
  const entries: string[] = [];

  for (const [moduleId, meta] of Object.entries(manager.serverReferenceMetaMap)) {
    for (const name of meta.exportNames) {
      const actionId = `${moduleId}#${name}`;
      entries.push(`  ${JSON.stringify(actionId)}: {
    id: ${JSON.stringify(actionId)},
    name: ${JSON.stringify(name)},
    moduleId: ${JSON.stringify(moduleId)},
  },`);
    }
  }

  if (entries.length === 0) {
    return "export default {};";
  }

  return `export default {
${entries.join("\n")}
};`;
}

/**
 * Generate the browser entry module
 */
function generateBrowserEntryModule(_manager: RscPluginManager): string {
  // This is a wrapper that can be used to bootstrap the client
  return `// Browser entry point for RSC hydration
export { createFromReadableStream } from "@my-react/react-server/client";
export { hydrateRoot } from "@my-react/react-dom/client";
`;
}

/**
 * Generate build assets manifest from bundle
 */
function generateBuildAssetsManifest(
  manager: RscPluginManager,
  bundle: Record<string, { type: string; fileName: string; isEntry?: boolean; viteMetadata?: { importedCss?: Set<string> } }>
): { bootstrapScriptContent: string; clientReferenceDeps: Record<string, { js: string[]; css: string[] }>; cssLinkPrecedence: boolean } {
  const clientReferenceDeps: Record<string, { js: string[]; css: string[] }> = {};
  const base = manager.config?.base ?? "/";

  // Find the main entry chunk for bootstrap first
  let mainEntryChunk: string | null = null;
  for (const [_chunkId, output] of Object.entries(bundle)) {
    if (output.type === "chunk" && (output as { isEntry?: boolean }).isEntry) {
      mainEntryChunk = output.fileName;
      break;
    }
  }

  // Fallback: look for index chunk
  if (!mainEntryChunk) {
    for (const output of Object.values(bundle)) {
      if (output.type === "chunk" && output.fileName.includes("index") && !output.fileName.includes("chunk")) {
        mainEntryChunk = output.fileName;
        break;
      }
    }
  }

  // Collect deps for each client reference
  for (const [_moduleId, meta] of Object.entries(manager.clientReferenceMetaMap)) {
    const chunkId = meta.groupChunkId;

    if (chunkId && bundle[chunkId]) {
      const chunk = bundle[chunkId];
      if (chunk.type === "chunk") {
        const css = [...(chunk.viteMetadata?.importedCss ?? [])].map((c) => `${base}${c}`);
        clientReferenceDeps[meta.referenceKey] = {
          js: [`${base}${chunk.fileName}`],
          css,
        };
      }
    } else if (mainEntryChunk) {
      // If no specific chunk, client component is in main bundle
      const mainChunk = Object.values(bundle).find((o) => o.fileName === mainEntryChunk);
      const css = mainChunk ? [...(mainChunk.viteMetadata?.importedCss ?? [])].map((c) => `${base}${c}`) : [];
      clientReferenceDeps[meta.referenceKey] = {
        js: [`${base}${mainEntryChunk}`],
        css,
      };
    } else {
      clientReferenceDeps[meta.referenceKey] = { js: [], css: [] };
    }
  }

  const bootstrapScriptContent = mainEntryChunk ? `import("${base}${mainEntryChunk}")` : "";

  return {
    bootstrapScriptContent,
    clientReferenceDeps,
    cssLinkPrecedence: true,
  };
}

/**
 * Helper to create a virtual module ID
 */
export function toVirtualId(name: string): string {
  return RESOLVED_PREFIX + name;
}

/**
 * Helper to check if an ID is a virtual module
 */
export function isVirtualId(id: string): boolean {
  return id.startsWith(RESOLVED_PREFIX + "virtual:my-react-rsc/");
}
