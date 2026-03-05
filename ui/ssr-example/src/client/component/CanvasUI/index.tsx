import { Flex, useColorModeValue } from "@chakra-ui/react";
import { use } from "@my-react/react";
import { Suspense } from "react";

const map = new Map<string, Promise<any>>();

const getPromise = (name: string) => {
  if (map.has(name)) {
    return map.get(name);
  }
  const promise = import(`@client/component/CanvasUI/${name}`);
  map.set(name, promise);
  return promise;
};

const Com = function Example({ mode }: { mode: "light" | "dark" }) {
  const Com = use(getPromise("Example"));

  return <Com.Exp mode={mode} />;
};

export const CanvasUI = () => {
  const mode = useColorModeValue("light", "dark");

  return (
    <Suspense
      fallback={
        <Flex width="full" height="full" justifyContent="center" alignItems="center">
          Loading...
        </Flex>
      }
    >
      <Com mode={mode} />
    </Suspense>
  );
};
