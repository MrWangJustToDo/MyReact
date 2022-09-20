import { all, takeLatest } from "redux-saga/effects";

import { serverActionName } from "../action";
import { serverAction } from "../reducer";

import { langSaga } from "./action";

type StartActionType = { type: ReturnType<typeof serverAction.GET_DATA_ACTION>; done: () => void; [props: string]: any };

function* rootSaga() {
  yield all([takeLatest<StartActionType>(serverAction.GET_DATA_ACTION(serverActionName.serverLang), ({ done, lang }) => langSaga({ done, lang }))]);
}

export { rootSaga };
