/**
 * @file Module ID utilities
 * Generate and manage module identifiers
 */

/**
 * Generate a unique module ID for a file path
 *
 * @param filePath - The file path
 * @param root - The project root
 * @returns A unique module ID
 */
export function generateModuleId(filePath: string, root: string): string {
  let id = filePath;

  // Remove the root prefix and normalize
  if (filePath.startsWith(root)) {
    id = filePath.slice(root.length);
  }

  // Ensure it starts with /
  if (!id.startsWith("/")) {
    id = "/" + id;
  }

  return id;
}

/**
 * Parse a module ID into its components
 *
 * @param moduleId - The module ID (e.g., "/src/Button.tsx#Button")
 * @returns Object with path and export name
 */
export function parseModuleId(moduleId: string): { path: string; exportName?: string } {
  const hashIndex = moduleId.indexOf("#");

  if (hashIndex === -1) {
    return { path: moduleId };
  }

  return {
    path: moduleId.slice(0, hashIndex),
    exportName: moduleId.slice(hashIndex + 1),
  };
}

/**
 * Create a full reference ID from module path and export name
 *
 * @param modulePath - The module path
 * @param exportName - The export name
 * @returns Combined reference ID
 */
export function createReferenceId(modulePath: string, exportName: string): string {
  return `${modulePath}#${exportName}`;
}
