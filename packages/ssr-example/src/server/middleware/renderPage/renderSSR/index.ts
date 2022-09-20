import { RenderError } from "@server/util/renderError";

import { composeRender } from "../compose";
import { globalEnv, initLang, initStore, loadLang, loadStore } from "../middleware";

import { targetRender as ChakraTargetRender } from "./renderChakra";

import type { AnyAction } from "../compose";

const targetRender: AnyAction = async ({ req, res, store, lang, env, page }) => {
  if (!store || !lang || !env || !page) {
    throw new RenderError("初始化失败", 500);
  } else {
    return ChakraTargetRender({ req, res, store, lang, env, page });
  }
};

export const renderSSR = composeRender(globalEnv, initLang, initStore, loadStore, loadLang)(targetRender);
