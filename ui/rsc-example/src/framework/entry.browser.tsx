"use client";

import { use, startTransition } from "@my-react/react";
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

function isThenable(value: unknown): value is Promise<unknown> {
  return typeof value === "object" && value !== null && typeof (value as Promise<unknown>).then === "function";
}

/**
 * Initial load may still be a Promise (stream / first fetch) → Suspense + use().
 * HMR / navigation: await Flight first, then swap a resolved tree so the previous UI
 * stays visible (official plugin-rsc pattern) instead of flashing the Suspense fallback.
 */
const View = ({ tree }: { tree: unknown }) => {
  if (!isThenable(tree)) {
    return tree as ReactNode;
  }
  const element = use(tree as never);
  return element as ReactNode;
};

const BrowserRoot = ({ client }: { client: FlightClient }) => {
  const [tree, setTree] = useState<unknown>(() => (stream ? client.createFromStream(stream) : fetchPayload(client, window.location.href)));

  useEffect(() => {
    const refetch = () => {
      void fetchPayload(client, window.location.href)
        .then((element) => {
          console.log("element", element);
          startTransition(() => {
            setTree(element);
          });
        })
        .catch((error) => {
          console.error("[@my-react/rsc-example] RSC refetch failed:", error);
        });
    };

    const stopNav = listenNavigation(refetch);

    if (import.meta.hot) {
      import.meta.hot.on("rsc:update", refetch);
    }

    return () => {
      stopNav();
      import.meta.hot?.off("rsc:update", refetch);
    };
  }, [client]);

  return (
    <Suspense fallback={<p className="loading">Loading...</p>}>
      <View tree={tree} />
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
