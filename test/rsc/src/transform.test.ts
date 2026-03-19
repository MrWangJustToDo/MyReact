/**
 * @file RSC Transform Tests
 * Tests for client and server module transformations
 */

import { parseModuleExports, generateModuleId, ClientModuleRegistry } from "../../../packages/myreact-vite/src/rsc/clientTransform";
import { parseServerActions, ServerActionRegistry } from "../../../packages/myreact-vite/src/rsc/serverTransform";

// Test helper
function test(name: string, fn: () => void | Promise<void>) {
  const result = fn();
  if (result instanceof Promise) {
    result
      .then(() => {
        console.log(`✓ ${name}`);
      })
      .catch((error) => {
        console.error(`✗ ${name}`);
        console.error(`  ${error instanceof Error ? error.message : String(error)}`);
        process.exitCode = 1;
      });
  } else {
    console.log(`✓ ${name}`);
  }
}

function assertEquals<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

function assertIncludes(arr: string[], item: string, message?: string) {
  if (!arr.includes(item)) {
    throw new Error(message || `Expected array to include ${item}`);
  }
}

console.log("\n=== RSC Transform Tests ===\n");

// Test parseModuleExports (now async)
test("parseModuleExports detects default export", async () => {
  const code = "export default function Component() {}";
  const result = await parseModuleExports(code);
  assertEquals(result.hasDefaultExport, true);
});

test("parseModuleExports detects named function export", async () => {
  const code = "export function MyComponent() {}";
  const result = await parseModuleExports(code);
  assertIncludes(result.exports, "MyComponent");
});

test("parseModuleExports detects named const export", async () => {
  const code = "export const Button = () => {};";
  const result = await parseModuleExports(code);
  assertIncludes(result.exports, "Button");
});

test("parseModuleExports detects multiple exports", async () => {
  const code = `
    export function ComponentA() {}
    export const ComponentB = () => {};
    export default function Main() {}
  `;
  const result = await parseModuleExports(code);
  assertEquals(result.hasDefaultExport, true);
  assertIncludes(result.exports, "ComponentA");
  assertIncludes(result.exports, "ComponentB");
});

test("parseModuleExports detects export list", async () => {
  const code = `
    function internalA() {}
    function internalB() {}
    export { internalA, internalB as externalB };
  `;
  const result = await parseModuleExports(code);
  assertIncludes(result.exports, "internalA");
  assertIncludes(result.exports, "externalB");
});

// Test generateModuleId
test("generateModuleId strips root prefix", () => {
  const id = generateModuleId("/Users/project/src/Component.tsx", "/Users/project");
  assertEquals(id, "/src/Component.tsx");
});

test("generateModuleId handles path without root", () => {
  const id = generateModuleId("/other/path/Component.tsx", "/Users/project");
  assertEquals(id, "/other/path/Component.tsx");
});

// Test ClientModuleRegistry
test("ClientModuleRegistry registers and retrieves modules", () => {
  const registry = new ClientModuleRegistry();
  registry.register("/src/Button.tsx", {
    moduleId: "/src/Button.tsx",
    exports: ["Button"],
    hasDefaultExport: true,
  });

  const info = registry.get("/src/Button.tsx");
  assertEquals(info?.moduleId, "/src/Button.tsx");
  assertIncludes(info?.exports || [], "Button");
  assertEquals(info?.hasDefaultExport, true);
});

test("ClientModuleRegistry generates manifest", () => {
  const registry = new ClientModuleRegistry();
  registry.register("/src/Button.tsx", {
    moduleId: "/src/Button.tsx",
    exports: ["Button", "IconButton"],
    hasDefaultExport: true,
  });

  const manifest = registry.generateManifest();
  assertEquals(manifest["/src/Button.tsx#default"]?.name, "default");
  assertEquals(manifest["/src/Button.tsx#Button"]?.name, "Button");
  assertEquals(manifest["/src/Button.tsx#IconButton"]?.name, "IconButton");
});

// Test parseServerActions (now async)
test("parseServerActions detects async function exports", async () => {
  const code = "export async function submitForm() {}";
  const result = await parseServerActions(code);
  assertIncludes(result, "submitForm");
});

test("parseServerActions detects multiple async functions", async () => {
  const code = `
    export async function createUser() {}
    export async function deleteUser() {}
    export async function updateUser() {}
  `;
  const result = await parseServerActions(code);
  assertIncludes(result, "createUser");
  assertIncludes(result, "deleteUser");
  assertIncludes(result, "updateUser");
});

test("parseServerActions detects async arrow functions", async () => {
  const code = "export const handleSubmit = async () => {}";
  const result = await parseServerActions(code);
  assertIncludes(result, "handleSubmit");
});

// Test ServerActionRegistry
test("ServerActionRegistry registers and retrieves actions", () => {
  const registry = new ServerActionRegistry();
  const actionId = registry.register("/src/actions.ts", "createUser");

  assertEquals(actionId, "/src/actions.ts#createUser");
  const info = registry.get(actionId);
  assertEquals(info?.name, "createUser");
  assertEquals(info?.moduleId, "/src/actions.ts");
});

test("ServerActionRegistry generates manifest", () => {
  const registry = new ServerActionRegistry();
  registry.register("/src/actions.ts", "createUser");
  registry.register("/src/actions.ts", "deleteUser");

  const manifest = registry.generateManifest();
  assertEquals(manifest["/src/actions.ts#createUser"]?.name, "createUser");
  assertEquals(manifest["/src/actions.ts#deleteUser"]?.name, "deleteUser");
});

console.log("\n=== All transform tests completed ===\n");
