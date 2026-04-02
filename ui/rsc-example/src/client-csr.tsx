"use client";
/**
 * RSC Example - Entry Point
 *
 * This example demonstrates React Server Components with MyReact.
 * - Server components run on the server and return serialized data
 * - Client components handle interactivity with "use client" directive
 * - Server actions handle form submissions with "use server" directive
 */

import { createFlightClient } from "@my-react/react-server/client";
import { use, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import type { ReactNode } from "react";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("[@my-react/rsc-example] Root element not found");
}

const config = (window as unknown as { __MY_REACT_RSC_CONFIG__?: { rscEndpoint?: string; actionEndpoint?: string } }).__MY_REACT_RSC_CONFIG__;

if (!config?.rscEndpoint) {
  throw new Error("[@my-react/rsc-example] Missing RSC configuration");
}

const rscEndpoint = config.rscEndpoint;
const actionEndpoint = config.actionEndpoint;
const client = createFlightClient({ actionEndpoint });

const View = ({ tree }: { tree: any }) => {
  const ele = use(tree);

  return ele;
};

const Main = () => {
  const [tree, setTree] = useState(() => {
    const stream = (window as unknown as { __MY_REACT_RSC_STREAM__?: ReadableStream<Uint8Array> }).__MY_REACT_RSC_STREAM__;
    if (stream) {
      return client.createFromStream(stream);
    }
    return Promise.resolve(null as ReactNode);
  });

  useEffect(() => {
    const fetchEle = async () => {
      const response = await fetch(`${rscEndpoint}?component=/src/App.tsx`);

      if (!response.ok || !response.body) {
        throw new Error(`[@my-react/rsc-example] Failed to fetch RSC payload: ${response.status}`);
      }

      const element = await client.createFromStream(response.body);

      return element as ReactNode;
    };

    setTree(() => fetchEle());
  }, []);

  return (
    <Suspense>
      <View tree={tree} />
    </Suspense>
  );
};

const root = createRoot(rootElement);

export const startRender = () => {
  root.render(<Main />);
};
