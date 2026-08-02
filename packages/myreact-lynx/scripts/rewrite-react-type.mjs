/**
 * rslib/webpack externals remap `@my-react/react/type` → `@my-react/react` in JS,
 * but tsc-emitted `.d.ts` still keeps the `/type` specifier. Rewrite those so
 * published consumers never depend on the internal subpath.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// eslint-disable-next-line no-undef
const ROOT = fileURLToPath(new URL("../dist", import.meta.url));
const FROM = /@my-react\/react\/type/g;
const TO = "@my-react/react";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.name.endsWith(".d.ts") && !entry.name.endsWith(".js")) continue;
    const source = await readFile(path, "utf8");
    if (!source.includes("@my-react/react/type")) continue;
    await writeFile(path, source.replace(FROM, TO));
  }
}

await walk(ROOT);
