import { delay } from "utils/delay";

import type { GetInitialStateType } from "types/components";

export const getInitialState: GetInitialStateType = async () => delay(1000, () => ({ props: { a: 1, b: 2, c: 3, d: { a: 1, b: 2, c: 3 } } }));
