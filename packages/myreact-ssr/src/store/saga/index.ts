import { all, takeLatest } from "redux-saga/effects";

import { apiName } from "config/api";
import { serverAction } from "store/reducer/server/share/action";

import { getHomeData, getBlogData, getLangData } from "./action";

type StartActionType = { type: ReturnType<typeof serverAction.GET_DATA_ACTION>; done: () => void; [props: string]: any };

function* rootSaga() {
  yield all([
    takeLatest<StartActionType>(serverAction.GET_DATA_ACTION(apiName.home), ({ done }) => getHomeData({ done })),
    takeLatest<StartActionType>(serverAction.GET_DATA_ACTION(apiName.blog), ({ done }) => getBlogData({ done })),
    takeLatest<StartActionType>(serverAction.GET_DATA_ACTION(apiName.lang), ({ done, lang }) => getLangData({ done, lang })),
  ]);
}

export { rootSaga };
