"use client";
/**
 * RSC Example - Entry Point
 *
 * This example demonstrates React Server Components with MyReact.
 * - Server components run on the server and return serialized data
 * - Client components handle interactivity with "use client" directive
 * - Server actions handle form submissions with "use server" directive
 */

import { Suspense, use, useEffect, useState } from "@my-react/react";
import { createRoot, hydrateRoot } from "@my-react/react-dom/client";
import { createFlightClient } from "@my-react/react-server/client";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("[@my-react/rsc-example] Root element not found");
}

const config = (window as unknown as { __MY_REACT_RSC_CONFIG__?: { rscEndpoint?: string; actionEndpoint?: string } }).__MY_REACT_RSC_CONFIG__;

if (!config?.rscEndpoint) {
  throw new Error("[@my-react/rsc-example] Missing RSC configuration");
}

const actionEndpoint = config.actionEndpoint;

const client = createFlightClient({ actionEndpoint });

const stream = (window as unknown as { __MY_REACT_RSC_STREAM__?: ReadableStream<Uint8Array> }).__MY_REACT_RSC_STREAM__;

const fetchPayload = (url: string) =>
  client.createFromFetch(
    fetch(`${config.rscEndpoint}?component=/src/root.tsx`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
  );

const View = ({ tree }: { tree: Promise<unknown> }) => {
  const element = use(tree as any);
  return element as any;
};

const BrowserRoot = () => {
  const [tree, setTree] = useState(() => (stream ? client.createFromStream(stream) : fetchPayload(window.location.href)));

  useEffect(() => {
    const onNavigation = () => {
      setTree(() => fetchPayload(window.location.href));
    };

    window.addEventListener("popstate", onNavigation);
    const oldPush = window.history.pushState;
    window.history.pushState = function (...args) {
      const res = oldPush.apply(this, args as any);
      onNavigation();
      return res;
    };
    const oldReplace = window.history.replaceState;
    window.history.replaceState = function (...args) {
      const res = oldReplace.apply(this, args as any);
      onNavigation();
      return res;
    };
    function onClick(e: MouseEvent) {
      const link = (e.target as Element).closest("a");
      if (link instanceof HTMLAnchorElement && link.origin === location.origin && !link.target) {
        e.preventDefault();
        history.pushState(null, "", link.href);
      }
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onNavigation);
      window.history.pushState = oldPush;
      window.history.replaceState = oldReplace;
    };
  }, []);

  return (
    <Suspense fallback={<p className="loading">Loading...</p>}>
      <View tree={tree as Promise<unknown>} />
    </Suspense>
  );
};

export const startHydrate = () => {
  if (stream) {
    hydrateRoot(rootElement, <BrowserRoot />);
    return;
  }

  const root = createRoot(rootElement);
  root.render(<BrowserRoot />);
};
