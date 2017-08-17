import { SCENE_CLEAR_REDUX } from "../actionTypes";
import {
  takeEvery,
  takeLatest,
  take,
  put,
  call,
  fork,
  select,
  cancel,
  getContext,
  setContext
} from "redux-saga/effects";
import createSenceReducer from "../reducers/createSenceReducer";
import { addReducer } from "../../utils";

function* forkSagaWithCotext(saga, ctx) {
  yield setContext(ctx);
  yield fork(saga);
}

export function* sceneApplyRedux({
  reducerKey,
  state,
  saga,
  reducer,
  setReduxInfo
}) {
  let arenaStore = yield getContext("store");
  reducerKey = addReducer(
    arenaStore,
    reducerKey,
    newReducerKey => createSenceReducer(reducer, newReducerKey),
    state
  );
  let sagaTask;
  if (saga)
    sagaTask = yield fork(forkSagaWithCotext, saga, { sceneKey: reducerKey });
  setReduxInfo({ reducerKey, sagaTask });
  return reducerKey;
}

function* sceneClearRedux({ reduxInfoPromise }) {
  let reduxInfo = yield reduxInfoPromise;
  let arenaStore = yield getContext("store");
  yield cancel(reduxInfo.sagaTask);
  arenaStore.removeReducer(reduxInfo.reducerKey);
}

export default function* saga() {
  yield takeEvery(SCENE_CLEAR_REDUX, sceneClearRedux);
}
