import { Body } from "./Body";
import { Head } from "./Head";

import type { EmotionCriticalToChunks } from "@emotion/server/types/create-instance";
import type { ReactElement } from "react";
import type { HelmetServerState } from "react-helmet-async";

export type HTMLProps = {
  env?: string;
  lang?: string;
  children?: string;
  preloadedState?: string;
  link?: ReactElement[];
  script?: ReactElement[];
  preLoad?: ReactElement[];
  emotionChunks?: EmotionCriticalToChunks;
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
