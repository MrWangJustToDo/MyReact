import { renderToFlightStream } from "@my-react/react-server/server";
import { createElement } from "react";

export async function renderRsc() {
  const module = await import("./App");
  const App = module.default || module;

  const element = createElement(App, null);
  return renderToFlightStream(element, {
    onError: (error) => {
      console.error("[@my-react/rsc-example] RSC render error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });
}
