import cookie from "js-cookie";
import { useCallback, useRef } from "react";
import { useSelector } from "react-redux";

import { apiName } from "config/api";
import { useDispatch } from "store";
import { getDataAction_Server } from "store/reducer/server/share/action";

import { useChangeLoadingWithoutRedux } from "./useLoadingBar";

import type { StoreState } from "types/store";

export const useLang = () => {
  const lang = useSelector<StoreState, string>((state) => state.client.currentLang.data);
  const { start, end } = useChangeLoadingWithoutRedux();
  const langRef = useRef(lang);
  const dispatch = useDispatch();
  langRef.current = lang;
  const changeLang = useCallback(
    (newLang: string) => {
      if (langRef.current !== newLang) {
        Promise.resolve(start())
          .then(() => {
            cookie.set("site_lang", newLang);
            return dispatch(getDataAction_Server({ name: apiName.lang, lang: newLang }));
          })
          .then(end)
          .catch(end);
      }
    },
    [dispatch, end, start]
  );

  return { lang, changeLang };
};
