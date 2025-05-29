import { Suspense, use, useEffect, useState } from "@my-react/react";
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
    <Box width={width - indent} flexDirection="column">
      <Text color="blue" wrap="truncate">
        📁 {path}
      </Text>
      <Box>
        <Box
          height="100%"
          borderStyle="single"
          borderLeftColor="gray"
          borderRight={false}
          borderTop={false}
          borderBottom={false}
          borderLeft={indent !== 0}
          width={1}
        />
        <Box flexDirection="column" width={width - 1 - indent}>
          {dirs.map((item) => {
            if (item.type === "directory") {
              return (
                <Suspense key={item.name} fallback={<Text>Loading...</Text>}>
                  <Dir path={item.name} indent={indent + 1} />
                </Suspense>
              );
            } else if (item.type === "file") {
              return (
                <Text key={item.name} color="green" wrap="truncate">
                  📃 {item.name}
                </Text>
              );
            } else {
              return (
                <Text key={item.name} color="red" wrap="truncate">
                  🔗 {item.name}
                </Text>
              );
            }
          })}
        </Box>
      </Box>
    </Box>
  );
};

const App = ({ path }: { path: string }) => {
  const relativePath = resolve(process.cwd(), path);

  const state = use(getStateWithCache(relativePath));

  if (state === "directory") {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <Dir path={relativePath} />
      </Suspense>
    );
  } else if (state === "file") {
    return (
      <Text color="green" wrap="truncate">
        📃 {relativePath}
      </Text>
    );
  } else {
    return (
      <Text color="red" wrap="truncate">
        🔗 {relativePath}
      </Text>
    );
  }
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const stdout = useStdout();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const width = stdout.stdout.columns || 80;

  return (
    <>
      <Text color="yellow">
        current time:
        <Text bold>{time.toLocaleTimeString()}</Text>
      </Text>
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
    <Suspense fallback={<Text>Loading...</Text>}>
      <Wrapper>
        <App path="./site/graphql" />
      </Wrapper>
    </Suspense>
  );
