/**
 * @file RSC Directive Detection Tests
 * Tests for "use client" and "use server" directive detection
 */

import {
  detectUseClientDirective,
  detectUseServerDirective,
  detectInlineUseServerDirective,
  detectDirectives,
  extractDirective,
} from "../../../packages/myreact-vite/src/rsc/directives";

// Test helper
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

function assertEquals<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

function assertDeepEquals<T>(actual: T, expected: T, message?: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

console.log("\n=== RSC Directive Detection Tests ===\n");

// Test detectUseClientDirective
test("detectUseClientDirective with double quotes", () => {
  const code = '"use client";\nimport React from "react";';
  assertEquals(detectUseClientDirective(code), true);
});

test("detectUseClientDirective with single quotes", () => {
  const code = "'use client';\nimport React from 'react';";
  assertEquals(detectUseClientDirective(code), true);
});

test("detectUseClientDirective with backticks", () => {
  const code = "`use client`;\nimport React from 'react';";
  assertEquals(detectUseClientDirective(code), true);
});

test("detectUseClientDirective with leading whitespace", () => {
  const code = '  \n  "use client";\nimport React from "react";';
  assertEquals(detectUseClientDirective(code), true);
});

test("detectUseClientDirective with leading comment", () => {
  const code = '// comment\n"use client";\nimport React from "react";';
  assertEquals(detectUseClientDirective(code), true);
});

test("detectUseClientDirective with multi-line comment", () => {
  const code = '/* comment */\n"use client";\nimport React from "react";';
  assertEquals(detectUseClientDirective(code), true);
});

test("detectUseClientDirective returns false for no directive", () => {
  const code = 'import React from "react";';
  assertEquals(detectUseClientDirective(code), false);
});

test("detectUseClientDirective returns false for use server", () => {
  const code = '"use server";\nexport async function action() {}';
  assertEquals(detectUseClientDirective(code), false);
});

// Test detectUseServerDirective
test("detectUseServerDirective with double quotes", () => {
  const code = '"use server";\nexport async function action() {}';
  assertEquals(detectUseServerDirective(code), true);
});

test("detectUseServerDirective returns false for no directive", () => {
  const code = "export async function action() {}";
  assertEquals(detectUseServerDirective(code), false);
});

test("detectUseServerDirective returns false for use client", () => {
  const code = '"use client";\nimport React from "react";';
  assertEquals(detectUseServerDirective(code), false);
});

// Test detectInlineUseServerDirective
test("detectInlineUseServerDirective with inline action", () => {
  const code = `
    import React from "react";
    
    export function Component() {
      async function handleSubmit() {
        "use server";
        // server action
      }
      return <form action={handleSubmit}></form>;
    }
  `;
  assertEquals(detectInlineUseServerDirective(code), true);
});

test("detectInlineUseServerDirective returns false for top-level use server", () => {
  const code = '"use server";\nexport async function action() {}';
  assertEquals(detectInlineUseServerDirective(code), false);
});

test("detectInlineUseServerDirective returns false for no directive", () => {
  const code = 'import React from "react";';
  assertEquals(detectInlineUseServerDirective(code), false);
});

// Test detectDirectives
test("detectDirectives for use client", () => {
  const code = '"use client";\nimport React from "react";';
  const result = detectDirectives(code);
  assertDeepEquals(result, {
    hasUseClient: true,
    hasUseServer: false,
    hasInlineUseServer: false,
  });
});

test("detectDirectives for use server", () => {
  const code = '"use server";\nexport async function action() {}';
  const result = detectDirectives(code);
  assertDeepEquals(result, {
    hasUseClient: false,
    hasUseServer: true,
    hasInlineUseServer: false,
  });
});

test("detectDirectives for no directive", () => {
  const code = 'import React from "react";';
  const result = detectDirectives(code);
  assertDeepEquals(result, {
    hasUseClient: false,
    hasUseServer: false,
    hasInlineUseServer: false,
  });
});

// Test extractDirective
test("extractDirective for use client", () => {
  const code = '"use client";\nimport React from "react";';
  const result = extractDirective(code);
  assertEquals(result.directive, "use client");
});

test("extractDirective for use server", () => {
  const code = '"use server";\nexport async function action() {}';
  const result = extractDirective(code);
  assertEquals(result.directive, "use server");
});

test("extractDirective for no directive", () => {
  const code = 'import React from "react";';
  const result = extractDirective(code);
  assertEquals(result.directive, null);
});

console.log("\n=== All directive tests completed ===\n");
