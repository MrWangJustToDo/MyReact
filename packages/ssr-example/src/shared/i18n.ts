import { serverActionName } from "./store/action";
import { getDataAction_Server } from "./store/reducer";

import type { AppDispatch } from "./store";

export const supportedLang = {
  en: "English",
  ar: "Arabic (عربي)",
};

export const loadCurrentLang = async (dispatch: AppDispatch, lang: keyof typeof supportedLang) => {
  await dispatch(getDataAction_Server({ name: serverActionName.serverLang, lang }));
};

export const defaultLang = "en";
