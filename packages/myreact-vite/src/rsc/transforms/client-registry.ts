/**
 * @file Client Module Registry
 * Tracks client components for manifest generation
 */

export interface ClientReferenceInfo {
  moduleId: string;
  exports: string[];
  hasDefaultExport: boolean;
  /** Unique reference key (hashed module ID) */
  referenceKey?: string;
  /** Exports that are actually rendered/used (for tree-shaking) */
  renderedExports?: string[];
  /** Server chunk that imports this client reference */
  serverChunk?: string;
  /** Chunk ID for grouping client references */
  groupChunkId?: string;
}

/**
 * Registry of client modules discovered during build
 */
export class ClientModuleRegistry {
  private modules: Map<string, ClientReferenceInfo> = new Map();

  register(moduleId: string, info: ClientReferenceInfo): void {
    // Generate reference key if not provided
    if (!info.referenceKey) {
      info.referenceKey = hashModuleId(moduleId);
    }
    // Initialize renderedExports if not provided
    if (!info.renderedExports) {
      info.renderedExports = [];
    }
    this.modules.set(moduleId, info);
  }

  get(moduleId: string): ClientReferenceInfo | undefined {
    return this.modules.get(moduleId);
  }

  getAll(): Map<string, ClientReferenceInfo> {
    return new Map(this.modules);
  }

  /**
   * Mark an export as rendered (used for tree-shaking)
   */
  markExportRendered(moduleId: string, exportName: string): void {
    const info = this.modules.get(moduleId);
    if (info && info.renderedExports && !info.renderedExports.includes(exportName)) {
      info.renderedExports.push(exportName);
    }
  }

  /**
   * Set the server chunk that imports this client reference
   */
  setServerChunk(moduleId: string, chunkName: string): void {
    const info = this.modules.get(moduleId);
    if (info) {
      info.serverChunk = chunkName;
    }
  }

  /**
   * Set the group chunk ID for client reference grouping
   */
  setGroupChunkId(moduleId: string, groupChunkId: string): void {
    const info = this.modules.get(moduleId);
    if (info) {
      info.groupChunkId = groupChunkId;
    }
  }

  generateManifest(): Record<string, { id: string; name: string; chunks: string[]; css?: string[]; referenceKey?: string }> {
    const manifest: Record<string, { id: string; name: string; chunks: string[]; css?: string[]; referenceKey?: string }> = {};

    for (const [moduleId, info] of this.modules) {
      // Use rendered exports if available, otherwise use all exports
      const exports =
        info.renderedExports && info.renderedExports.length > 0
          ? info.renderedExports
          : info.hasDefaultExport
            ? ["default", ...info.exports.filter((e) => e !== "default")]
            : info.exports;

      for (const exportName of exports) {
        const key = `${moduleId}#${exportName}`;
        manifest[key] = {
          id: moduleId,
          name: exportName,
          chunks: [],
          referenceKey: info.referenceKey,
        };
      }
    }

    return manifest;
  }

  /**
   * Get all modules grouped by server chunk
   */
  getModulesByServerChunk(): Record<string, ClientReferenceInfo[]> {
    const groups: Record<string, ClientReferenceInfo[]> = {};

    for (const info of this.modules.values()) {
      const chunk = info.serverChunk ?? "__default__";
      if (!groups[chunk]) {
        groups[chunk] = [];
      }
      groups[chunk].push(info);
    }

    return groups;
  }

  clear(): void {
    this.modules.clear();
  }
}

/**
 * Hash module ID to create a short reference key
 */
function hashModuleId(moduleId: string): string {
  let hash = 0;
  for (let i = 0; i < moduleId.length; i++) {
    const char = moduleId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
