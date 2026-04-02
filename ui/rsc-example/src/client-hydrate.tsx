/**
 * RSC Example - Entry Point
 *
 * This example demonstrates React Server Components with MyReact.
 * - Server components run on the server and return serialized data
 * - Client components handle interactivity with "use client" directive
 * - Server actions handle form submissions with "use server" directive
 */

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

export const startHydrate = () => {
  if (stream) {
    client.hydrate(rootElement, stream);
  }
};
