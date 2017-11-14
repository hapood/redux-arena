import ActionTypes from "../ActionTypes";
import {
  takeEvery,
  take,
  put,
  fork,
  select,
  cancel,
  setContext,
  getContext,
  ForkEffect
} from "redux-saga/effects";
import { Task } from "redux-saga";
import { Action } from "redux";
import { applySceneBundle } from "./sceneBundleSaga";
import { CurtainState } from "../reducers/types";

function* takeEverySceneBundleAction() {
  let _reducerKey = yield getContext("_reducerKey");
  let lastTask;
  while (true) {
    let action = yield take(ActionTypes.ARENA_CURTAIN_LOAD_SCENE);
    if (action.arenaReducerDict._arenaCurtain.reducerKey === _reducerKey) {
      if (lastTask && lastTask.isRunning()) {
        yield cancel(lastTask);
      }
      lastTask = yield fork(applySceneBundle, action);
    }
  }
}

/**
 * Listen to the loading of each scene,
 * and handle different processing functions when handling scene switches.
 *
 * @param {any} ctx
 */

function* forkSagaWithContext(ctx: any) {
  yield setContext(ctx);
  yield fork(takeEverySceneBundleAction);
}

/**
 * It is used to initialize the ArenaSwitch layer.
 *
 * @param {any} { reducerKey, setSagaTask }
 */

interface InitArenaCurtainAction extends Action {
  reducerKey: string;
  setSagaTask: (sagaTask: Task) => void;
}

function* initArenaCurtainSaga({
  reducerKey,
  setSagaTask
}: InitArenaCurtainAction) {
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

interface KillArenaCurtainAction extends Action {
  sagaTaskPromise: Promise<object>;
  reducerKey: string;
}

function* killArenaCurtainSaga({
  sagaTaskPromise,
  reducerKey
}: KillArenaCurtainAction) {
  let sagaTask = yield sagaTaskPromise;
  if (sagaTask) yield cancel(sagaTask);
  let store = yield getContext("store");
  yield put({
    type: ActionTypes.ARENA_STATETREE_NODE_DISABLE,
    reducerKey
  });
  let { reduxInfo } = (yield select(
    (state: any) => state[reducerKey]
  )) as CurtainState<{}>;
  if (reduxInfo && reduxInfo.reducerKey != null) {
    yield put({
      type: ActionTypes.ARENA_STATETREE_NODE_DELETE,
      reducerKey: reduxInfo.reducerKey
    });
    store.removeSingleReducer(reduxInfo.reducerKey);
  }
  store.removeSingleReducer(reducerKey);
}

export default function* saga() {
  yield takeEvery(ActionTypes.ARENA_CURTAIN_INIT_SAGA, initArenaCurtainSaga);
  yield takeEvery(ActionTypes.ARENA_CURTAIN_CLEAR_REDUX, killArenaCurtainSaga);
}
