/**
 * @file Client Module Registry
 * Tracks client components for manifest generation
 */

export interface ClientReferenceInfo {
  moduleId: string;
  exports: string[];
  hasDefaultExport: boolean;
}

/**
 * Registry of client modules discovered during build
 */
export class ClientModuleRegistry {
  private modules: Map<string, ClientReferenceInfo> = new Map();

  register(moduleId: string, info: ClientReferenceInfo): void {
    this.modules.set(moduleId, info);
  }

  get(moduleId: string): ClientReferenceInfo | undefined {
    return this.modules.get(moduleId);
  }

  getAll(): Map<string, ClientReferenceInfo> {
    return new Map(this.modules);
  }

  generateManifest(): Record<string, { id: string; name: string; chunks: string[] }> {
    const manifest: Record<string, { id: string; name: string; chunks: string[] }> = {};

    for (const [moduleId, info] of this.modules) {
      if (info.hasDefaultExport) {
        manifest[`${moduleId}#default`] = { id: moduleId, name: "default", chunks: [] };
      }

      for (const exportName of info.exports) {
        if (exportName !== "default") {
          manifest[`${moduleId}#${exportName}`] = { id: moduleId, name: exportName, chunks: [] };
        }
      }
    }

    return manifest;
  }

  clear(): void {
    this.modules.clear();
  }
}
