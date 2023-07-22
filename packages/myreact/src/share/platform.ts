import { once } from "@my-react/react-shared";

import { currentRenderPlatform } from "./env";

import type { RenderPlatform } from "../renderPlatform";

/**
 * @internal
 */
export const initRenderPlatform = once((platform: RenderPlatform) => (currentRenderPlatform.current = platform));
