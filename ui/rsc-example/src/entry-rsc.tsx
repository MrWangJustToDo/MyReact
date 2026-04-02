import { createElement } from "@my-react/react";
import { renderToFlightStream } from "@my-react/react-server/server";

export async function renderRsc(url: string) {
  const module = await import("./root");
  const Root = module.default || module;

  const element = createElement(Root, { url });
  return renderToFlightStream(element, {
    onError: (error) => {
      console.error("[@my-react/rsc-example] RSC render error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });
}
