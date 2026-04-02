import { startRender } from "./client-csr";
import { startHydrate } from "./client-hydrate";

const csr = false;

if (csr) {
  startRender();
} else {
  startHydrate();
}
