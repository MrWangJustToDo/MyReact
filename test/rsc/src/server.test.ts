/**
 * @file RSC Server Tests
 * Tests for server-side RSC functionality
 */

import { registerClientReference, createClientModuleProxy } from "../../../packages/myreact-server/src/server/clientReferenceMap";
import { ServerComponentDispatch } from "../../../packages/myreact-server/src/server/ServerComponentDispatch";
import { registerServerReference, getServerAction, serverActionRegistry } from "../../../packages/myreact-server/src/server/serverReferenceMap";
import { CLIENT_REFERENCE_SYMBOL, SERVER_REFERENCE_SYMBOL } from "../../../packages/myreact-server/src/shared/types";

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

function assertNotNull<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || "Expected value to not be null/undefined");
  }
}

console.log("\n=== RSC Server Tests ===\n");

// Test ServerComponentDispatch
test("ServerComponentDispatch creates instance", () => {
  const dispatch = new ServerComponentDispatch();
  assertNotNull(dispatch);
});

test("ServerComponentDispatch.registerClientReference works", () => {
  const dispatch = new ServerComponentDispatch();
  dispatch.registerClientReference("/src/Button.tsx", "Button");
  // No error means success
});

test("ServerComponentDispatch.registerServerReference works", () => {
  const dispatch = new ServerComponentDispatch();
  dispatch.registerServerReference("action-123", () => {});
  const action = dispatch.getServerAction("action-123");
  assertNotNull(action);
});

test("ServerComponentDispatch.processServerComponent works", async () => {
  const dispatch = new ServerComponentDispatch();
  const mockComponent = async () => ({ type: "div", props: { children: "Hello" }, key: null }) as any;
  const result = await dispatch.processServerComponent(mockComponent, {});
  assertNotNull(result);
});

test("ServerComponentDispatch.isClientReference detects client refs", () => {
  const dispatch = new ServerComponentDispatch();
  const clientRef = {
    $$typeof: CLIENT_REFERENCE_SYMBOL,
    $$id: "/src/Button.tsx",
    $$name: "Button",
  };
  assertEquals(dispatch.isClientReference(clientRef), true);
  assertEquals(dispatch.isClientReference({}), false);
});

test("ServerComponentDispatch.isServerReference detects server refs", () => {
  const dispatch = new ServerComponentDispatch();
  const serverRef = {
    $$typeof: SERVER_REFERENCE_SYMBOL,
    $$id: "action-123",
    $$name: "submitForm",
  };
  assertEquals(dispatch.isServerReference(serverRef), true);
  assertEquals(dispatch.isServerReference({}), false);
});

test("ServerComponentDispatch.isAsyncFunction detects async functions", () => {
  const dispatch = new ServerComponentDispatch();
  const asyncFn = async () => {};
  const syncFn = () => {};
  assertEquals(dispatch.isAsyncFunction(asyncFn), true);
  assertEquals(dispatch.isAsyncFunction(syncFn), false);
});

// Test registerClientReference
test("registerClientReference creates valid proxy", () => {
  const proxy = registerClientReference({}, "/src/Button.tsx", "Button");
  assertEquals(proxy.$$typeof, CLIENT_REFERENCE_SYMBOL);
  assertEquals(proxy.$$id, "/src/Button.tsx");
  assertEquals(proxy.$$name, "Button");
});

// Test createClientModuleProxy
test("createClientModuleProxy creates module proxy", () => {
  const proxy = createClientModuleProxy("/src/components.tsx");
  assertNotNull(proxy);
  // Access a property to get a client reference
  const buttonRef = proxy.Button;
  assertEquals(buttonRef.$$id, "/src/components.tsx");
  assertEquals(buttonRef.$$name, "Button");
});

// Test registerServerReference
test("registerServerReference registers action", () => {
  // Clear registry first
  serverActionRegistry.clear();

  const action = async () => "result";
  const registered = registerServerReference(action, "test-action-1", "testAction");

  assertEquals(registered.$$typeof, SERVER_REFERENCE_SYMBOL);
  assertEquals(registered.$$id, "test-action-1");
  assertEquals(registered.$$name, "testAction");
});

// Test getServerAction
test("getServerAction retrieves registered action", () => {
  // Clear and re-register
  serverActionRegistry.clear();

  const action = async () => "result";
  registerServerReference(action, "test-action-2", "testAction");

  const retrieved = getServerAction("test-action-2");
  assertNotNull(retrieved);
});

console.log("\n=== All server tests completed ===\n");
