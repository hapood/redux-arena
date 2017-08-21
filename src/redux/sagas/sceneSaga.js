import { SCENE_CLEAR_REDUX, SCENE_SET_STATE } from "../actionTypes";
import {
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancel,
  cancelled,
  getContext,
  setContext
} from "redux-saga/effects";
import createSenceReducer from "../reducers/createSenceReducer";
import { addReducer, replaceReducer } from "../../utils";

function* forkSagaWithContext(saga, ctx) {
  yield setContext(ctx);
  yield fork(saga);
}

export function* sceneApplyRedux({
  reducerKey,
  state,
  saga,
  reducer,
  curSceneBundle,
  reduxInfoPromise,
  resolveReduxInfo,
  resolveObsoleteReduxInfo
}) {
  let reduxInfo;
  let newReducerKey, newSagaTask;
  try {
    reduxInfo = yield reduxInfoPromise;
    newReducerKey = reduxInfo.reducerKey;
    newSagaTask = reduxInfo.sagaTask;
    let arenaStore = yield getContext("store");
    if (saga !== curSceneBundle.saga) {
      if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
    }
    if (reduxInfo.reducerKey == null) {
      newReducerKey = addReducer(
        arenaStore,
        reducerKey,
        newReducerKey => createSenceReducer(reducer, newReducerKey),
        state
      );
    } else if (reducerKey == null || reducerKey === reduxInfo.reducerKey) {
      if (reducer !== curSceneBundle.reducer) {
        newReducerKey = replaceReducer(
          arenaStore,
          reduxInfo.reducerKey,
          newReducerKey => createSenceReducer(reducer, newReducerKey),
          state === curSceneBundle.state ? null : state
        );
      } else if (state !== curSceneBundle.state) {
        newReducerKey = reduxInfo.reducerKey;
        yield put({
          type: SCENE_SET_STATE,
          _sceneKey: reduxInfo.reducerKey,
          state
        });
      }
    } else if (reducerKey !== reduxInfo.reducerKey) {
      newReducerKey = add(
        arenaStore,
        reducerKey,
        newReducerKey => createSenceReducer(reducer, newReducerKey),
        state === curSceneBundle.state ? null : state
      );
    }
    if (
      saga !== curSceneBundle.saga ||
      newReducerKey !== reduxInfo.reducerKey
    ) {
      if (saga) {
        newSagaTask = yield fork(forkSagaWithContext, saga, {
          sceneKey: newReducerKey
        });
      }
    }
  } finally {
    if (yield cancelled()) {
      resolveObsoleteReduxInfo({
        reducerKey:
          newReducerKey === reduxInfo.reducerKey ? null : newReducerKey,
        sagaTask: newSagaTask
      });
    } else {
      resolveReduxInfo({
        reducerKey: newReducerKey,
        sagaTask: newSagaTask
      });
      resolveObsoleteReduxInfo({
        reducerKey:
          newReducerKey === reduxInfo.reducerKey ? null : reduxInfo.reducerKey,
        sagaTask: reduxInfo.sagaTask
      });
    }
  }
  return newReducerKey;
}

function* sceneClearRedux({ reduxInfoPromise }) {
  let reduxInfo = yield reduxInfoPromise;
  let arenaStore = yield getContext("store");
  if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
  if (reduxInfo.reducerKey) arenaStore.removeReducer(reduxInfo.reducerKey);
}

export default function* saga() {
  yield takeEvery(SCENE_CLEAR_REDUX, sceneClearRedux);
}
