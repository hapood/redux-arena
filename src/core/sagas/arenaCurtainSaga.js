import {
  ARENA_CURTAIN_LOAD_SCENE,
  ARENA_CURTAIN_LOAD_ASYNCSCENE,
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX,
  ARENA_CURTAIN_SET_STATE
} from "../actionTypes";
import {
  takeEvery,
  take,
  put,
  fork,
  select,
  cancel,
  setContext,
  getContext
} from "redux-saga/effects";
import { applySceneBundle, applyAsyncSceneBundle } from "./sceneBundleSaga";

function* takeEverySceneBundleAction() {
  let _reducerKey = yield getContext("_reducerKey");
  let lastTask;
  while (true) {
    let action = yield take([
      ARENA_CURTAIN_LOAD_ASYNCSCENE,
      ARENA_CURTAIN_LOAD_SCENE
    ]);
    if (action.parentArenaReducerDict._arenaCurtain.reducerKey === _reducerKey) {
      if (lastTask && lastTask.isRunning()) {
        yield cancel(lastTask);
      }
      if (action.type === ARENA_CURTAIN_LOAD_ASYNCSCENE) {
        lastTask = yield fork(applyAsyncSceneBundle, action);
      } else {
        lastTask = yield fork(applySceneBundle, action);
      }
    }
  }
}

/**
 * Listen to the loading of each scene,
 * and handle different processing functions when handling scene switches.
 * 
 * @param {any} ctx 
 */

function* forkSagaWithContext(ctx) {
  yield setContext(ctx);
  yield fork(takeEverySceneBundleAction);
}

/**
 * It is used to initialize the ArenaSwitch layer.
 * 
 * @param {any} { reducerKey, setSagaTask } 
 */

function* initArenaCurtainSaga({
  reducerKey,
  setSagaTask,
  isWaitingSwitchAction = false
}) {
  let sagaTask = yield fork(forkSagaWithContext, {
    _reducerKey: reducerKey
  });
  setSagaTask(sagaTask);
}

/**
 * It is used to cancel the task of the ArenaSwitch layer.
 * 
 * @param {any} { sagaTaskPromise } 
 */

function* killArenaCurtainSaga({ sagaTaskPromise, reducerKey }) {
  let sagaTask = yield sagaTaskPromise;
  if (sagaTask) yield cancel(sagaTask);
  let store = yield getContext("store");
  let { reduxInfo } = yield select(state => state[reducerKey]);
  if (reduxInfo.sagaTask) {
    yield cancel(reduxInfo.sagaTask);
  }
  if (reduxInfo.reducerKey) {
    store.removeReducer(reduxInfo.reducerKey);
  }
  store.removeReducer(reducerKey);
}

export default function* saga() {
  yield takeEvery(ARENA_CURTAIN_INIT_SAGA, initArenaCurtainSaga);
  yield takeEvery(ARENA_CURTAIN_CLEAR_REDUX, killArenaCurtainSaga);
}
