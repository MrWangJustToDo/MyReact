import { call, put } from "redux-saga/effects";

import { apiName } from "config/api";
import { getDataFail_Server, getDataLoading_server, getDataSuccess_Server } from "store/reducer/server/share/action";
import { delay } from "utils/delay";
import { log } from "utils/log";

export function* getBlogData({ done }: { done: () => void }) {
  try {
    yield put(getDataLoading_server({ name: apiName.blog }));
    const { code, state, data } = yield call((apiName: apiName) => delay(2000, () => ({ code: 0, data: [1, 2, 3, 4, 5], apiName })), apiName.blog);
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.blog, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.blog, data: state }));
    }
  } catch (e) {
    log(`getBlogData error: ${(e as Error).message}`, "error");
    yield put(getDataFail_Server({ name: apiName.blog, error: (e as Error).toString() }));
  } finally {
    done();
  }
}
