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
import { addReducer, replaceReducer } from "../../utils";

function* forkSagaWithCotext(saga, ctx) {
  yield setContext(ctx);
  yield fork(saga);
}

export function* sceneApplyRedux({
  reducerKey,
  state,
  saga,
  reducer,
  curSceneBundle,
  reduxInfo
}) {
  let arenaStore = yield getContext("store");
  if (reduxInfo.reducerKey == null) {
    reducerKey = addReducer(
      arenaStore,
      reducerKey,
      newReducerKey => createSenceReducer(reducer, newReducerKey),
      state
    );
  } else if (reducerKey == null && reducer != curSceneBundle.reducer) {
    reducerKey = replaceReducer(
      arenaStore,
      reducerKey,
      newReducerKey => createSenceReducer(reducer, newReducerKey),
      state
    );
  } else if (reducerKey != null) {
    removeAndAddReducer(
      arenaStore,
      removeReducerKey,
      addReducerKey,
      newReducerKey => createSenceReducer(reducer, newReducerKey),
      state
    );
  }
  let sagaTask;
  if (saga != reduxInfo.saga) {
    yield cancel(reduxInfo.sagaTask);
    if (saga) {
      sagaTask = yield fork(forkSagaWithCotext, saga, { sceneKey: reducerKey });
    }
  }
  return { reducerKey, saga, sagaTask };
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
