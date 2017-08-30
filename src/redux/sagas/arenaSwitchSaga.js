import {
  ARENASWITCH_LOAD_SCENE,
  ARENASWITCH_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_PLAY_START,
  ARENASWITCH_INIT_SAGA,
  ARENASWITCH_KILL_SAGA,
  ARENASWITCH_SET_STATE
} from "../actionTypes";
import {
  ARENASWITCH_EVENT_LOADSCENE_START,
  ARENASWITCH_EVENT_LOADSCENE_CONTINUE,
  ARENASWITCH_EVENT_LOADSCENE_COMPLETE
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
      ARENASWITCH_LOAD_ASYNCSCENE,
      ARENASWITCH_LOAD_SCENE
    ]);
    if (
      action.parentArenaReducerDict._curSwitch.reducerKey ===
      arenaSwitchReducerKey
    ) {
      if (lastTask && lastTask.isRunning()) {
        yield cancel(lastTask);
      }
      if (action.type === ARENASWITCH_LOAD_ASYNCSCENE) {
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
    let action = yield take(SCENE_LOAD_START);
    if (action.arenaSwitchReducerKey === arenaSwitchReducerKey) {
      yield put({
        type: ARENASWITCH_SET_STATE,
        arenaSwitchReducerKey,
        state: {
          isWaiting: true
        }
      });
      let { match, location } = yield select(
        state => state[arenaSwitchReducerKey]
      );
      let nextAction = Object.assign({}, action, {
        type: ARENASWITCH_EVENT_LOADSCENE_START,
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
    let action = yield take(SCENE_PLAY_START);
    if (action.arenaSwitchReducerKey === arenaSwitchReducerKey) {
      yield put({
        type: ARENASWITCH_SET_STATE,
        arenaSwitchReducerKey,
        state: {
          isWaiting: true
        }
      });
      let { match, location } = yield select(
        state => state[arenaSwitchReducerKey]
      );
      let nextAction = Object.assign({}, action, {
        type: ARENASWITCH_EVENT_LOADSCENE_COMPLETE,
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
  isInstantSwitch = true
}) {
  let sagaTask = yield fork(forkSagaWithContext, {
    arenaSwitchReducerKey: reducerKey,
    isInstantSwitch
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
  yield takeEvery(ARENASWITCH_INIT_SAGA, initArenaSwitchSaga);
  yield takeEvery(ARENASWITCH_KILL_SAGA, killArenaSwitchSaga);
}
