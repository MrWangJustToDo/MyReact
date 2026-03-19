/**
 * @file Server Action Registry
 * Tracks server actions for manifest generation
 */

export interface ServerActionInfo {
  actionId: string;
  name: string;
  moduleId: string;
  isInline: boolean;
}

/**
 * Registry of server actions discovered during build
 */
export class ServerActionRegistry {
  private actions: Map<string, ServerActionInfo> = new Map();

  register(moduleId: string, name: string, isInline: boolean = false): string {
    const actionId = this.generateActionId(moduleId, name);

    this.actions.set(actionId, {
      actionId,
      name,
      moduleId,
      isInline,
    });

    return actionId;
  }

  get(actionId: string): ServerActionInfo | undefined {
    return this.actions.get(actionId);
  }

  getAll(): Map<string, ServerActionInfo> {
    return new Map(this.actions);
  }

  private generateActionId(moduleId: string, name: string): string {
    return `${moduleId}#${name}`;
  }

  generateManifest(): Record<string, { id: string; name: string; moduleId: string }> {
    const manifest: Record<string, { id: string; name: string; moduleId: string }> = {};

    for (const [actionId, info] of this.actions) {
      manifest[actionId] = {
        id: info.actionId,
        name: info.name,
        moduleId: info.moduleId,
      };
    }

    return manifest;
  }

  clear(): void {
    this.actions.clear();
  }
}
