/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Suspense, use } from "@my-react/react";
import { Box, render, Text, useStdout } from "@my-react/react-terminal";
import { readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const getDirs = async (path: string) => {
  const list = await readdir(path, { withFileTypes: true });
  return list.map((item) => {
    if (item.isDirectory()) {
      return { name: path + "/" + item.name, type: "directory" } as const;
    } else if (item.isFile()) {
      return { name: path + "/" + item.name, type: "file" } as const;
    } else {
      return { name: path + "/" + item.name, type: "other" } as const;
    }
  });
};

const getState = async (path: string) => {
  const re = await stat(path);
  if (re.isDirectory()) {
    return "directory";
  } else if (re.isFile()) {
    return "file";
  } else {
    return "other";
  }
};

const dirCache = new Map<string, ReturnType<typeof getDirs>>();

const getDirWithCache = (path: string) => {
  if (dirCache.has(path)) {
    return dirCache.get(path);
  }
  const re = getDirs(path);
  dirCache.set(path, re);
  return re;
};

const stateCache = new Map<string, ReturnType<typeof getState>>();

const getStateWithCache = (path: string) => {
  if (stateCache.has(path)) {
    return stateCache.get(path);
  }
  const re = getState(path);
  stateCache.set(path, re);
  return re;
};

const Dir = ({ path, indent = 0 }: { path: string; indent?: number }) => {
  const dirs = use(getDirWithCache(path));

  const stdout = useStdout();

  const width = stdout.stdout.columns || 80;

  return (
    <Box marginLeft={indent} width={width} flexDirection="column">
      <Text color="blue" wrap="truncate">
        {path}
      </Text>
      {dirs.map((item) => {
        if (item.type === "directory") {
          return (
            // @ts-ignore
            <Suspense key={item.name} fallback={<Text>Loading...</Text>}>
              <Dir path={item.name} indent={indent + 1} />
            </Suspense>
          );
        } else if (item.type === "file") {
          return (
            <Text key={item.name} color="green" wrap="truncate">
              ✔ {item.name}
            </Text>
          );
        } else {
          return (
            <Text key={item.name} color="red" wrap="truncate">
              ✘ {item.name}
            </Text>
          );
        }
      })}
    </Box>
  );
};

const App = ({ path }: { path: string }) => {
  const relativePath = resolve(process.cwd(), path);

  const state = use(getStateWithCache(relativePath));

  if (state === "directory") {
    return (
      // @ts-ignore
      <Suspense fallback={<Text>Loading...</Text>}>
        <Dir path={relativePath} />
      </Suspense>
    );
  } else if (state === "file") {
    return (
      <Text color="green" wrap="truncate">
        ✔ {relativePath}
      </Text>
    );
  } else {
    return (
      <Text color="red" wrap="truncate">
        ✘ {relativePath}
      </Text>
    );
  }
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const stdout = useStdout();

  const width = stdout.stdout.columns || 80;

  return (
    <>
      <Text color="cyan">
        current width:
        <Text bold>{width}</Text>
      </Text>
      {children}
    </>
  );
};

export const test = () =>
  render(
    // @ts-ignore
    <Suspense fallback={<Text>Loading...</Text>}>
      <Wrapper>
        <App path="./site/graphql" />
      </Wrapper>
    </Suspense>
  );
