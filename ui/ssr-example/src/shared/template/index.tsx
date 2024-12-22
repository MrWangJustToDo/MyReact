import { Body } from "./Body";
import { Head } from "./Head";

import type { extractCriticalToChunks } from "@emotion/server";
import type { ReactElement } from "react";
import type { HelmetServerState } from "react-helmet-async";

export type HTMLProps = {
  env?: string;
  lang?: string;
  children?: string | JSX.Element;
  preloadedState?: string;
  link?: ReactElement[];
  script?: ReactElement[];
  preLoad?: ReactElement[];
  refresh?: ReactElement[];
  emotionChunks?: ReturnType<typeof extractCriticalToChunks>;
  helmetContext?: { helmet?: HelmetServerState };
};

export const HTML = (props: HTMLProps) => {
  return (
    <html lang={props.lang || ""}>
      <Head {...props} />
      <Body {...props} />
    </html>
  );
};
