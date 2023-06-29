import { useCallbackRef } from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "@shared";
import { serverActionName } from "@shared/store/action";
import { getDataAction_Server } from "@shared/store/reducer";

import { useLoading } from "./useLoadingStore";

export const useLang = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.client.clientLang.data);
  const setLoading = useLoading((state) => state.setLoading);
  const changeLang = useCallbackRef((newLang: string) => {
    if (lang !== newLang) {
      Promise.resolve()
        .then(() => setLoading(true))
        .then(() => dispatch(getDataAction_Server({ name: serverActionName.serverLang, lang: newLang })))
        .then(() => setLoading(false));
    }
  });

  return { lang, changeLang };
};
