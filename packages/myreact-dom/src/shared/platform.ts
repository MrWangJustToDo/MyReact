import { log } from "./debug";

import type { RenderPlatform } from "@my-react/react";

export class DomPlatform implements RenderPlatform {
  name = "dom";

  constructor(name: string) {
    this.name = name;
  }

  log(args) {
    log(args);
  }
}
