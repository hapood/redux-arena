import {
  ARENA_SWITCH_LOAD_SCENE,
  ARENA_SWITCH_LOAD_ASYNCSCENE,
  ARENA_SCENE_LOAD_START,
  ARENA_SCENE_PLAY_START,
  ARENA_SWITCH_INIT_SAGA,
  ARENA_SWITCH_KILL_SAGA,
  ARENA_SWITCH_SET_STATE
} from "../actionTypes";
import {
  ARENA_SWITCH_EVENT_LOADARENA_SCENE_START,
  ARENA_SWITCH_EVENT_LOADARENA_SCENE_CONTINUE,
  ARENA_SWITCH_EVENT_LOADARENA_SCENE_COMPLETE
} from "../../actionTypes";
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

function* loadSceneStart() {
  let arenaSwitchReducerKey = yield getContext("arenaSwitchReducerKey");
  while (true) {
    let action = yield take(ARENA_SCENE_LOAD_START);
    if (action.arenaSwitchReducerKey === arenaSwitchReducerKey) {
      let isWaitingSwitchAction = yield getContext("isWaitingSwitchAction");
      yield put({
        type: ARENA_SWITCH_SET_STATE,
        arenaSwitchReducerKey,
        state: {
          isWaiting: isWaitingSwitchAction
        }
      });
      let { match, location } = yield select(
        state => state[arenaSwitchReducerKey]
      );
      let nextAction = Object.assign({}, action, {
        type: ARENA_SWITCH_EVENT_LOADARENA_SCENE_START,
        match,
        location
      });
      yield put(nextAction);
    }
  }
}

function* loadSceneComplete() {
  let arenaSwitchReducerKey = yield getContext("arenaSwitchReducerKey");
  while (true) {
    let action = yield take(ARENA_SCENE_PLAY_START);
    if (action.arenaSwitchReducerKey === arenaSwitchReducerKey) {
      yield put({
        type: ARENA_SWITCH_SET_STATE,
        arenaSwitchReducerKey,
        state: {
          isWaiting: true
        }
      });
      let { match, location } = yield select(
        state => state[arenaSwitchReducerKey]
      );
      let nextAction = Object.assign({}, action, {
        type: ARENA_SWITCH_EVENT_LOADARENA_SCENE_COMPLETE,
        match,
        location
      });
      yield put(nextAction);
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
  yield fork(loadSceneStart);
  yield fork(loadSceneComplete);
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
  let sagaTask = yield fork(forkSagaWithContext, {
    arenaSwitchReducerKey: reducerKey,
    isWaitingSwitchAction
  });
  setSagaTask(sagaTask);
}

/**
 * It is used to cancel the task of the ArenaSwitch layer.
 * 
 * @param {any} { sagaTaskPromise } 
 */

function* killArenaSwitchSaga({ sagaTaskPromise }) {
  let sagaTask = yield sagaTaskPromise;
  if (sagaTask) yield cancel(sagaTask);
}

export default function* saga() {
  yield takeEvery(ARENA_SWITCH_INIT_SAGA, initArenaSwitchSaga);
  yield takeEvery(ARENA_SWITCH_KILL_SAGA, killArenaSwitchSaga);
}
