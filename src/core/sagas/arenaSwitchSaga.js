import {
  ARENA_SWITCH_LOAD_SCENE,
  ARENA_SWITCH_LOAD_ASYNCSCENE,
  ARENA_SWITCH_INIT_SAGA,
  ARENA_SWITCH_CLEAR_REDUX,
  ARENA_SWITCH_SET_STATE
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
import { bindActionCreators } from "redux";
import { applySceneBundle, applyAsyncSceneBundle } from "./sceneBundleSaga";

function* takeEverySceneBundleAction() {
  let arenaSwitchReducerKey = yield getContext("arenaSwitchReducerKey");
  let lastTask;
  while (true) {
    let action = yield take([
      ARENA_SWITCH_LOAD_ASYNCSCENE,
      ARENA_SWITCH_LOAD_SCENE
    ]);
    if (
      action.parentArenaReducerDict._curSwitch.reducerKey ===
      arenaSwitchReducerKey
    ) {
      if (lastTask && lastTask.isRunning()) {
        yield cancel(lastTask);
      }
      if (action.type === ARENA_SWITCH_LOAD_ASYNCSCENE) {
        lastTask = yield fork(applyAsyncSceneBundle, action);
      } else {
        lastTask = yield fork(applySceneBundle, action);
      }
    }
  }
}

/**
 * Listen to the loading of each scene,
 * and handle different processing functions when handling sence switches.
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

function* initArenaSwitchSaga({
  reducerKey,
  setSagaTask,
  isWaitingSwitchAction = false
}) {
  yield put({
    type: ARENA_SWITCH_SET_STATE,
    arenaSwitchReducerKey: reducerKey,
    state: {
      isWaiting: isWaitingSwitchAction
    }
  });
  let sagaTask = yield fork(forkSagaWithContext, {
    arenaSwitchReducerKey: reducerKey
  });
  setSagaTask(sagaTask);
}

/**
 * It is used to cancel the task of the ArenaSwitch layer.
 * 
 * @param {any} { sagaTaskPromise } 
 */

function* killArenaSwitchSaga({ sagaTaskPromise, reducerKey }) {
  let sagaTask = yield sagaTaskPromise;
  if (sagaTask) yield cancel(sagaTask);
  let store = yield getContext("store");
  store.removeReducer(reducerKey);
}

export default function* saga() {
  yield takeEvery(ARENA_SWITCH_INIT_SAGA, initArenaSwitchSaga);
  yield takeEvery(ARENA_SWITCH_CLEAR_REDUX, killArenaSwitchSaga);
}
