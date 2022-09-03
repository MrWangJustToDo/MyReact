import { call, put } from "redux-saga/effects";

import { apiName } from "config/api";
import { getDataFail_Server, getDataLoading_server, getDataSuccess_Server } from "store/reducer/server/share/action";
import { delay } from "utils/delay";
import { log } from "utils/log";

export function* getHomeData({ done }: { done: () => void }) {
  try {
    yield put(getDataLoading_server({ name: apiName.home }));
    const { code, state, data } = yield call((apiName: apiName) => delay(2000, () => ({ code: 0, data: "hello world", apiName })), apiName.home);
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.home, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.home, data: state }));
    }
  } catch (e) {
    log(`getHomeData error: ${(e as Error).message}`, "error");
    yield put(getDataFail_Server({ name: apiName.home, error: (e as Error).toString() }));
  } finally {
    done();
  }
}
