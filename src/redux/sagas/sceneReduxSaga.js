import {
  ARENA_SCENE_CLEAR_REDUX,
  ARENA_SCENE_REPLACE_STATE,
  ARENA_SWITCH_SET_STATE
} from "../actionTypes";
import {
  takeEvery,
  take,
  put,
  call,
  fork,
  spawn,
  select,
  cancel,
  cancelled,
  getContext,
  setContext
} from "redux-saga/effects";
import createSenceReducer from "../reducers/createSenceReducer";
import { sceneAddReducer, sceneReplaceReducer } from "../../utils";
import { getArenaSwitchInitState } from "../reducers";

function* forkSagaWithContext(saga, ctx) {
  yield setContext(ctx);
  yield fork(saga);
}

export function* sceneApplyRedux({
  arenaSwitchReducerKey,
  reducerKey,
  state,
  saga,
  reducer,
  curSceneBundle,
  reduxInfo
}) {
  let newReducerKey = reduxInfo.reducerKey;
  let newSagaTask = reduxInfo.sagaTask;
  let arenaStore = yield getContext("store");
  try {
    if (saga !== curSceneBundle.saga) {
      if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
    }
  } finally {
    if (yield cancelled()) {
    }
  }
  if (reduxInfo.reducerKey == null) {
    newReducerKey = sceneAddReducer(
      arenaStore,
      reducerKey,
      newReducerKey => createSenceReducer(reducer, newReducerKey),
      state
    );
  } else if (reducerKey == null || reducerKey === reduxInfo.reducerKey) {
    if (reducer !== curSceneBundle.reducer) {
      newReducerKey = sceneReplaceReducer(
        arenaStore,
        reduxInfo.reducerKey,
        newReducerKey => createSenceReducer(reducer, newReducerKey),
        state === curSceneBundle.state ? null : state
      );
    } else if (state !== curSceneBundle.state) {
      newReducerKey = reduxInfo.reducerKey;
      yield put({
        type: ARENA_SCENE_REPLACE_STATE,
        _sceneReducerKey: reduxInfo.reducerKey,
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

  if (saga) {
    if (
      saga !== curSceneBundle.saga ||
      newReducerKey !== reduxInfo.reducerKey ||
      reduxInfo.sagaTask.isCancelled()
    ) {
      newSagaTask = yield spawn(forkSagaWithContext, saga, {
        sceneReducerKey: newReducerKey
      });
    }
  }

  return {
    newSagaTask,
    newReducerKey
  };
}

function* sceneClearRedux({ arenaSwitchReducerKey, reduxInfo }) {
  let arenaStore = yield getContext("store");
  if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
  if (reduxInfo.reducerKey) {
    yield put({
      type: ARENA_SWITCH_SET_STATE,
      arenaSwitchReducerKey: arenaSwitchReducerKey,
      state: getArenaSwitchInitState()
    });
    arenaStore.removeReducer(reduxInfo.reducerKey);
  }
}

export default function* saga() {
  yield takeEvery(ARENA_SCENE_CLEAR_REDUX, sceneClearRedux);
}
