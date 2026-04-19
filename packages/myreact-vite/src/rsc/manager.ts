/**
 * @file RSC Plugin Manager
 * Central state manager shared across all RSC build phases
 */

import fs from "node:fs";
import path from "node:path";

import type { ResolvedConfig, ViteDevServer, Rollup } from "vite";

/**
 * Metadata for client reference modules discovered during build
 */
export interface ClientReferenceMeta {
  /** Module ID for importing */
  importId: string;
  /** Unique identifier (hashed during build) */
  referenceKey: string;
  /** Optional package source for third-party modules */
  packageSource?: string;
  /** List of exported names */
  exportNames: string[];
  /** Exports actually rendered/used (populated during real build) */
  renderedExports: string[];
  /** Which RSC chunk imports this client reference */
  serverChunk?: string;
  /** Chunk ID for client reference grouping */
  groupChunkId?: string;
}

/**
 * Metadata for server reference modules (server actions)
 */
export interface ServerReferenceMeta {
  /** Module ID for importing */
  importId: string;
  /** Unique identifier */
  referenceKey: string;
  /** List of exported function names */
  exportNames: string[];
}

/**
 * Asset dependencies for a module
 */
export interface AssetDeps {
  js: string[];
  css: string[];
}

/**
 * Manifest of client assets for SSR/RSC
 */
export interface AssetsManifest {
  /** Bootstrap script content for hydration */
  bootstrapScriptContent?: string;
  /** Map of client reference key to asset dependencies */
  clientReferenceDeps: Record<string, AssetDeps>;
  /** Whether to use CSS link precedence */
  cssLinkPrecedence?: boolean;
}

/**
 * Build assets manifest file name
 */
export const BUILD_ASSETS_MANIFEST_NAME = "__my_react_rsc_assets_manifest.js";

/**
 * Central state manager for RSC plugin across all build phases
 *
 * @public
 */
export class RscPluginManager {
  /** Vite dev server instance (dev mode only) */
  server?: ViteDevServer;

  /** Resolved Vite config */
  config!: ResolvedConfig;

  /** RSC endpoint path */
  rscEndpoint: string = "/__rsc";

  /** Server action endpoint path */
  actionEndpoint: string = "/__rsc_action";

  /** Rollup bundles from each environment */
  bundles: Record<string, Rollup.OutputBundle> = {};

  /** Built assets manifest (populated during client build) */
  buildAssetsManifest: AssetsManifest | undefined;

  /** Whether current build is a scan build (no output) */
  isScanBuild: boolean = false;

  /** Map of client reference metadata, keyed by module ID */
  clientReferenceMetaMap: Record<string, ClientReferenceMeta> = {};

  /** Client references grouped by chunk for code splitting */
  clientReferenceGroups: Record<string, ClientReferenceMeta[]> = {};

  /** Map of server reference metadata, keyed by module ID */
  serverReferenceMetaMap: Record<string, ServerReferenceMeta> = {};

  /** Map of server resources for CSS deps */
  serverResourcesMetaMap: Record<string, { key: string }> = {};

  /**
   * Sort reference maps for stable builds
   */
  stabilize(): void {
    this.clientReferenceMetaMap = sortObject(this.clientReferenceMetaMap);
    this.serverReferenceMetaMap = sortObject(this.serverReferenceMetaMap);
    this.serverResourcesMetaMap = sortObject(this.serverResourcesMetaMap);
  }

  /**
   * Convert absolute path to relative from project root
   */
  toRelativeId(id: string): string {
    return normalizePath(path.relative(this.config.root, id));
  }

  /**
   * Register a client reference module
   */
  registerClientReference(moduleId: string, meta: Omit<ClientReferenceMeta, "referenceKey" | "renderedExports">): void {
    const referenceKey = hashString(moduleId);
    this.clientReferenceMetaMap[moduleId] = {
      ...meta,
      referenceKey,
      renderedExports: [],
    };
  }

  /**
   * Register a server reference (server action)
   */
  registerServerReference(moduleId: string, exportNames: string[]): void {
    const referenceKey = hashString(moduleId);
    this.serverReferenceMetaMap[moduleId] = {
      importId: moduleId,
      referenceKey,
      exportNames,
    };
  }

  /**
   * Get client reference by module ID
   */
  getClientReference(moduleId: string): ClientReferenceMeta | undefined {
    return this.clientReferenceMetaMap[moduleId];
  }

  /**
   * Get server reference by module ID
   */
  getServerReference(moduleId: string): ServerReferenceMeta | undefined {
    return this.serverReferenceMetaMap[moduleId];
  }

  /**
   * Mark an export as rendered (used during real RSC build)
   */
  markExportRendered(moduleId: string, exportName: string): void {
    const meta = this.clientReferenceMetaMap[moduleId];
    if (meta && !meta.renderedExports.includes(exportName)) {
      meta.renderedExports.push(exportName);
    }
  }

  /**
   * Set the server chunk for a client reference
   */
  setServerChunk(moduleId: string, chunkName: string): void {
    const meta = this.clientReferenceMetaMap[moduleId];
    if (meta) {
      meta.serverChunk = chunkName;
    }
  }

  /**
   * Set the group chunk ID for a client reference (output chunk in client build)
   */
  setGroupChunkId(moduleId: string, chunkId: string): void {
    const meta = this.clientReferenceMetaMap[moduleId];
    if (meta) {
      meta.groupChunkId = chunkId;
    }
  }

  /**
   * Find client reference by normalized module path
   */
  findClientReferenceByPath(normalizedPath: string): ClientReferenceMeta | undefined {
    for (const [moduleId, meta] of Object.entries(this.clientReferenceMetaMap)) {
      if (moduleId === normalizedPath || moduleId.endsWith(normalizedPath) || normalizedPath.endsWith(moduleId)) {
        return meta;
      }
    }
    return undefined;
  }

  /**
   * Write assets manifest to build output directories
   */
  writeAssetsManifest(environmentNames: string[]): void {
    if (!this.buildAssetsManifest) return;

    const assetsManifestCode = `export default ${serializeValue(this.buildAssetsManifest)}`;

    for (const name of environmentNames) {
      const env = this.config.environments?.[name];
      if (!env) continue;

      const manifestPath = path.join(env.build.outDir, BUILD_ASSETS_MANIFEST_NAME);
      fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
      fs.writeFileSync(manifestPath, assetsManifestCode);
    }
  }

  /**
   * Generate client manifest for runtime
   */
  generateClientManifest(): Record<string, { id: string; name: string; chunks: string[]; css: string[] }> {
    const manifest: Record<string, { id: string; name: string; chunks: string[]; css: string[] }> = {};

    for (const [moduleId, meta] of Object.entries(this.clientReferenceMetaMap)) {
      const exports = meta.renderedExports.length > 0 ? meta.renderedExports : meta.exportNames;

      for (const exportName of exports) {
        const key = `${moduleId}#${exportName}`;
        const deps = this.buildAssetsManifest?.clientReferenceDeps[meta.referenceKey];

        manifest[key] = {
          id: moduleId,
          name: exportName,
          chunks: deps?.js ?? [],
          css: deps?.css ?? [],
        };
      }
    }

    return manifest;
  }

  /**
   * Generate server action manifest for runtime
   */
  generateServerManifest(): Record<string, { id: string; name: string; moduleId: string }> {
    const manifest: Record<string, { id: string; name: string; moduleId: string }> = {};

    for (const [moduleId, meta] of Object.entries(this.serverReferenceMetaMap)) {
      for (const name of meta.exportNames) {
        const actionId = `${moduleId}#${name}`;
        manifest[actionId] = {
          id: actionId,
          name,
          moduleId,
        };
      }
    }

    return manifest;
  }

  /**
   * Clear all state (for fresh builds)
   */
  clear(): void {
    this.bundles = {};
    this.buildAssetsManifest = undefined;
    this.isScanBuild = false;
    this.clientReferenceMetaMap = {};
    this.clientReferenceGroups = {};
    this.serverReferenceMetaMap = {};
    this.serverResourcesMetaMap = {};
  }
}

/**
 * Sort object keys for stable output
 */
function sortObject<T>(obj: Record<string, T>): Record<string, T> {
  const sorted: Record<string, T> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key];
  }
  return sorted;
}

/**
 * Normalize path separators
 */
function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

/**
 * Simple hash function for generating reference keys
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Serialize value to JavaScript code
 */
function serializeValue(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

/**
 * Create a new RscPluginManager instance
 */
export function createRscPluginManager(): RscPluginManager {
  return new RscPluginManager();
}
