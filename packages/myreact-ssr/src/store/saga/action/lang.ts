import { call, put, select } from "redux-saga/effects";

import { actionName } from "config/action";
import { apiName } from "config/api";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import { getDataFail_Server, getDataLoading_server, getDataSuccess_Server } from "store/reducer/server/share/action";
import { createRequest } from "utils/fetcher";
import { log } from "utils/log";

import type { StoreState } from "types/store";

export function* getLangData({ done, lang }: { done: () => void; lang: string }) {
  try {
    const langData: { [props: string]: any } = yield select<(s: StoreState) => { [props: string]: any }>((state) => state.server.lang.data);
    if (!langData[lang]) {
      yield put(getDataLoading_server({ name: apiName.lang }));
      const { code, state, data } = yield call((apiName: apiName) => createRequest({ apiPath: apiName, query: { lang }, cache: false }).run(), apiName.lang);
      if (code === 0) {
        yield put(getDataSuccess_Server({ name: apiName.lang, data }));
      } else {
        log(`getLangData error: ${state}`, "error");
        yield put(getDataFail_Server({ name: apiName.lang, data: state }));
      }
    }
    yield put(setDataSuccess_client({ name: actionName.currentLang, data: lang }));
  } catch (e) {
    log(`getLangData error: ${typeof e === "object" ? (e as Error).message : e}`, "error");
    yield put(getDataFail_Server({ name: apiName.lang, error: (e as Error).toString() }));
  } finally {
    done();
  }
}
