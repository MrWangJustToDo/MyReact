import { Flex } from "@chakra-ui/react";
import { use } from "@my-react/react";
import { Suspense, useMemo } from "react";

const map = new Map<string, Promise<any>>();

const getPromise = (name: string) => {
  if (map.has(name)) {
    return map.get(name);
  }
  const promise = import(`@client/component/CanvasUI/${name}`);
  map.set(name, promise);
  return promise;
};

export const CanvasUI = () => {
  const Com = useMemo(() => {
    return function Example() {
      const Com = use(getPromise('Example'));

      return <Com.Exp />;
    };
  }, []);

  return (
    <Suspense
      fallback={
        <Flex width="full" height="full" justifyContent="center" alignItems="center">
          Loading...
        </Flex>
      }
    >
      <Com />
    </Suspense>
  );
};
