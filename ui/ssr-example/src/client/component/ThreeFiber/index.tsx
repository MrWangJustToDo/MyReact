import { use } from "@my-react/react";
import { Suspense, useMemo } from "react";

const map = new Map<string, Promise<any>>();

const getPromise = (name: string) => {
  if (map.has(name)) {
    return map.get(name);
  }
  const promise = import(`@client/component/ThreeFiber/${name}`);
  map.set(name, promise);
  return promise;
};

export const ThreeFiberExample = ({ name }: { name: string }) => {
  const Com = useMemo(() => {
    return function Example() {
      const Com = use(getPromise(name));

      return <Com.Exp />;
    };
  }, [name]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Com />
    </Suspense>
  );
};
