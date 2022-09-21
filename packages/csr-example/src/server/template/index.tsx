import { Body } from "./Body";
import { Head } from "./Head";

import type { ReactElement } from "react";

export type HTMLProps = {
  env?: string;
  lang?: string;
  children?: string;
  preloadedState?: string;
  link?: ReactElement[];
  script?: ReactElement[];
  preLoad?: ReactElement[];
};

export const HTML = (props: HTMLProps) => {
  return (
    <html lang={props.lang || ""}>
      <Head {...props} />
      <Body {...props} />
    </html>
  );
};
