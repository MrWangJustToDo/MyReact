import axios from "axios";
import { call, put, select } from "redux-saga/effects";

import { getPublicApi } from "@shared/env";
import { clientActionName, serverActionName } from "@shared/store/action";
import { getDataFail_Server, getDataLoading_server, getDataSuccess_Server, setDataSuccess_client } from "@shared/store/reducer";

import type { StoreState } from "@shared/store/type";

export function* langSaga({ done, lang }: { done: () => void; lang: string }) {
  try {
    const langData: { [props: string]: any } = yield select<(s: StoreState) => { [props: string]: unknown }>((state) => state.server.serverLang.data);
    if (!langData[lang]) {
      yield put(getDataLoading_server({ name: serverActionName.serverLang }));
      const request = axios.create({ baseURL: getPublicApi() });
      const {
        data: { data },
      } = yield call((apiName: string) => request.get(apiName, { params: { lang } }), "/api/lang");
      yield put(getDataSuccess_Server({ name: serverActionName.serverLang, data: { [lang]: data } }));
    }
    yield put(setDataSuccess_client({ name: clientActionName.clientLang, data: lang }));
  } catch (e) {
    if (__DEVELOPMENT__) {
      console.error("langSaga error: ", (e as Error).message);
    }
    yield put(getDataFail_Server({ name: serverActionName.serverLang, error: (e as Error).toString() }));
  } finally {
    done();
  }
}
