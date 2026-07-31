"use client";

import { use } from "@my-react/react";
import { createRoot, hydrateRoot } from "@my-react/react-dom/client";
import { createFlightClient } from "@my-react/react-server/client";
import { Suspense, useEffect, useState } from "react";

import { listenNavigation } from "./navigation";

import type { FlightClient } from "@my-react/react-server/client";
import type { ReactNode } from "react";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("[@my-react/rsc-example] Root element not found");
}

const root = rootElement;

const config = window.__MY_REACT_RSC_CONFIG__;

if (!config?.rscEndpoint) {
  throw new Error("[@my-react/rsc-example] Missing RSC configuration");
}

const actionEndpoint = config.actionEndpoint;
const stream = window.__MY_REACT_RSC_STREAM__;

const fetchPayload = (client: FlightClient, url: string) => client.createFromFetch(fetch(`${config.rscEndpoint}?url=${encodeURIComponent(url)}`));

const View = ({ tree }: { tree: Promise<unknown> }) => {
  const element = use(tree as never);
  return element as ReactNode;
};

const BrowserRoot = ({ client }: { client: FlightClient }) => {
  const [tree, setTree] = useState(() => (stream ? client.createFromStream(stream) : fetchPayload(client, window.location.href)));

  useEffect(() => {
    return listenNavigation(() => {
      setTree(() => fetchPayload(client, window.location.href));
    });
  }, [client]);

  return (
    <Suspense fallback={<p className="loading">Loading...</p>}>
      <View tree={tree as Promise<unknown>} />
    </Suspense>
  );
};

async function main() {
  const client = await createFlightClient({ actionEndpoint });
  const app = <BrowserRoot client={client} />;

  // SSR mode: hydrate into server-rendered #root. No-SSR: always createRoot (empty shell).
  if (__RSC_ENABLE_SSR__ && stream) {
    hydrateRoot(root, app);
    return;
  }

  createRoot(root).render(app);
}

main();
