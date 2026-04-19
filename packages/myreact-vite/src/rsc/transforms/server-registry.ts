/**
 * @file Server Action Registry
 * Tracks server actions for manifest generation
 */

export interface ServerActionInfo {
  actionId: string;
  name: string;
  moduleId: string;
  isInline: boolean;
  /** Unique reference key for the action */
  referenceKey?: string;
  /** Whether this action is encrypted (for closure binding) */
  isEncrypted?: boolean;
}

/**
 * Registry of server actions discovered during build
 */
export class ServerActionRegistry {
  private actions: Map<string, ServerActionInfo> = new Map();
  private moduleExports: Map<string, string[]> = new Map();

  register(moduleId: string, name: string, isInline: boolean = false): string {
    const actionId = this.generateActionId(moduleId, name);
    const referenceKey = hashActionId(actionId);

    this.actions.set(actionId, {
      actionId,
      name,
      moduleId,
      isInline,
      referenceKey,
    });

    // Track exports per module
    const exports = this.moduleExports.get(moduleId) ?? [];
    if (!exports.includes(name)) {
      exports.push(name);
      this.moduleExports.set(moduleId, exports);
    }

    return actionId;
  }

  get(actionId: string): ServerActionInfo | undefined {
    return this.actions.get(actionId);
  }

  getByReferenceKey(referenceKey: string): ServerActionInfo | undefined {
    for (const info of this.actions.values()) {
      if (info.referenceKey === referenceKey) {
        return info;
      }
    }
    return undefined;
  }

  getAll(): Map<string, ServerActionInfo> {
    return new Map(this.actions);
  }

  /**
   * Get all exports for a module
   */
  getModuleExports(moduleId: string): string[] {
    return this.moduleExports.get(moduleId) ?? [];
  }

  /**
   * Get all registered modules
   */
  getModules(): string[] {
    return [...this.moduleExports.keys()];
  }

  private generateActionId(moduleId: string, name: string): string {
    return `${moduleId}#${name}`;
  }

  generateManifest(): Record<string, { id: string; name: string; moduleId: string; referenceKey?: string }> {
    const manifest: Record<string, { id: string; name: string; moduleId: string; referenceKey?: string }> = {};

    for (const [actionId, info] of this.actions) {
      manifest[actionId] = {
        id: info.actionId,
        name: info.name,
        moduleId: info.moduleId,
        referenceKey: info.referenceKey,
      };
    }

    return manifest;
  }

  /**
   * Generate manifest grouped by module
   */
  generateModuleManifest(): Record<string, { importId: string; referenceKey: string; exportNames: string[] }> {
    const manifest: Record<string, { importId: string; referenceKey: string; exportNames: string[] }> = {};

    for (const [moduleId, exports] of this.moduleExports) {
      manifest[moduleId] = {
        importId: moduleId,
        referenceKey: hashActionId(moduleId),
        exportNames: exports,
      };
    }

    return manifest;
  }

  clear(): void {
    this.actions.clear();
    this.moduleExports.clear();
  }
}

/**
 * Hash action ID to create a short reference key
 */
function hashActionId(actionId: string): string {
  let hash = 0;
  for (let i = 0; i < actionId.length; i++) {
    const char = actionId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
