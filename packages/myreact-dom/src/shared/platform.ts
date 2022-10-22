import { log } from "./debug";

import type { RenderPlatform } from "@my-react/react";

export class DomPlatform implements RenderPlatform {
  name = "dom";
  log = log;

  constructor(name: string) {
    this.name = name;
  }
}
