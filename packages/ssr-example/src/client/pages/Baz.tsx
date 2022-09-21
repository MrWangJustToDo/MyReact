import { Code, Heading } from "@chakra-ui/react";
import { lazy, Suspense } from "react";

import { delay } from "@client/utils";

import type { GetInitialStateType } from "@client/types/common";

// current page will generate static page

const BazLazy = lazy(() => import("@client/component").then(({ LazyComponent }) => ({ default: LazyComponent })));

const Test = () => {
  return <BazLazy />;
};

export default function Index(props: { foo: string }) {
  return (
    <>
      <Heading>Baz page</Heading>
      <Code>{props.foo} page</Code>
      <Suspense fallback={<>123</>}>
        <Test />
      </Suspense>
    </>
  );
}

export const getInitialState: GetInitialStateType = async ({ pathName }) => {
  console.log("get initial state", pathName);
  await delay(2000);
  return { props: { foo: "baz from getInitialState" } };
};

export const isStatic = true;
