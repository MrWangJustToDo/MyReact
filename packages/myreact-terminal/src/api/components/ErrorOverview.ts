import { createElement } from "@my-react/react";
import codeExcerpt from "code-excerpt";
import fs from "node:fs";
import { cwd } from "node:process";
import StackUtils from "stack-utils";

import { Box } from "./Box";
import { Text } from "./Text";

import type { CodeExcerpt } from "code-excerpt";

// Error's source file is reported as file:///home/user/file.js
// This function removes the file://[cwd] part
const cleanupPath = (path: string | undefined): string | undefined => {
  return path?.replace(`file://${cwd()}/`, "");
};

const stackUtils = new StackUtils({
  cwd: cwd(),
  internals: StackUtils.nodeInternals(),
});

type ErrorOverviewProps = {
  readonly error: Error;
};

export function ErrorOverview({ error }: ErrorOverviewProps) {
  const stack = error.stack ? error.stack.split("\n").slice(1) : undefined;
  const origin = stack ? stackUtils.parseLine(stack[0]) : undefined;
  const filePath = cleanupPath(origin?.file);
  let excerpt: CodeExcerpt[] | undefined;
  let lineWidth = 0;

  if (filePath && origin?.line && fs.existsSync(filePath)) {
    const sourceCode = fs.readFileSync(filePath, "utf8");
    excerpt = codeExcerpt(sourceCode, origin.line);

    if (excerpt) {
      for (const { line } of excerpt) {
        lineWidth = Math.max(lineWidth, String(line).length);
      }
    }
  }

  return createElement(
    Box,
    { flexDirection: "column", padding: 1 },
    createElement(Box, null, createElement(Text, { backgroundColor: "red", color: "white" }, "ERROR"), createElement(Text, null, error.message)),
    origin && filePath && createElement(Box, { marginTop: 1 }, createElement(Text, { dimColor: true }, filePath, ":", origin.line, ":", origin.column)),
    origin &&
      excerpt &&
      createElement(
        Box,
        { marginTop: 1, flexDirection: "column" },
        excerpt.map(({ line, value }) => {
          return createElement(
            Box,
            { key: line },
            createElement(
              Box,
              { width: lineWidth + 1 },
              createElement(Text, {
                dimColor: line !== origin.line,
                backgroundColor: line === origin.line ? "red" : undefined,
                color: line === origin.line ? "white" : undefined,
                children: String(line).padStart(lineWidth, " "),
              })
            ),
            createElement(Text, {
              key: line,
              color: line === origin.line ? "white" : undefined,
              backgroundColor: line === origin.line ? "red" : undefined,
              children: " " + value,
            })
          );
        })
      ),
    error.stack &&
      createElement(
        Box,
        { marginTop: 1, flexDirection: "column" },
        error.stack
          .split("\n")
          .slice(1)
          .map((line) => {
            const parsedLine = stackUtils.parseLine(line);
            if (!parsedLine) {
              return createElement(
                Box,
                { key: line },
                createElement(Text, { dimColor: true }, "- "),
                createElement(Text, { dimColor: true, bold: true }, line)
              );
            }
            return createElement(
              Box,
              { key: line },
              createElement(Text, { dimColor: true }, "- "),
              createElement(Text, { dimColor: true, bold: true }, parsedLine.function),
              createElement(Text, { dimColor: true, color: "gray" }, cleanupPath(parsedLine.file) ?? "", ":", parsedLine.line, ":", parsedLine.column)
            );
          })
      )
  );
}
