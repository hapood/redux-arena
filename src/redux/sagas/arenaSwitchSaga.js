import {
  ARENASWITCH_SWITCH_SCENE,
  ARENASWITCH_SET_STATE,
  SCENE_LOAD_END,
  ARENASWITCH_LOAD_ASYNCSCENE,
  ARENASWITCH_INIT_SAGA,
  ARENASWITCH_KILL_SAGA
} from "../actionTypes";
import {
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancel,
  cancelled,
  setContext,
  getContext
} from "redux-saga/effects";
import { connect } from "react-redux";
import {
  bindActionCreatorsWithSceneKey,
  createProxyMapStateToProps
} from "../../enhencedRedux";
import { bindActionCreators } from "redux";
import { sceneApplyRedux } from "./sceneSaga";

/**
 * Scene of the synchronous load function, it does the following.
 * 1. load, add, replace reducer.
 * 2. Set the state of the corresponding scene.
 * 3. Run the corresponding scene of the saga, cancel the last scene of the task.
 * 4. Connect redux according to the incoming mapStateToProps and actions.
 * 
 * @param {any} { arenaSwitchKey, sceneBundle } 
 */
function* arenaSwitchSwitchScene({ arenaSwitchKey, sceneBundle }) {
  let mapDispatchToProps;
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene
  } = yield select(state => state[arenaSwitchKey]);
  let options = sceneBundle.options || {};
  let reducerKey = yield* sceneApplyRedux({
    arenaSwitchKey,
    reducerKey: options.reducerKey,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    curSceneBundle,
    reduxInfo
  });
  if (sceneBundle.actions) {
    mapDispatchToProps = dispatch =>
      options.isPlainActions === true
        ? bindActionCreators(sceneBundle.actions, dispatch)
        : bindActionCreatorsWithSceneKey(
            sceneBundle.actions,
            dispatch,
            reducerKey
          );
  }
  let mapStateToProps;
  if (sceneBundle.mapStateToProps) {
    mapStateToProps = createProxyMapStateToProps(
      sceneBundle.mapStateToProps,
      reducerKey
    );
  }
  let PlayingScene = connect(mapStateToProps, mapDispatchToProps)(
    sceneBundle.Component
  );
  let displayName =
    sceneBundle.Component.displayName ||
    sceneBundle.Component.name ||
    "Unknown";
  PlayingScene.displayName = `SceneConnect({reducerKey:${reducerKey},Component:${displayName}})`;
  let newArenaState = {
    PlayingScene,
    curSceneBundle: sceneBundle
  };
  yield put({
    type: ARENASWITCH_SET_STATE,
    arenaSwitchKey,
    state: newArenaState
  });
}

/**
 * The asynchronous loading function of the scene, 
 * and finally the synchronous load function
 * 
 * @param {any} { arenaSwitchKey, asyncSceneBundle } 
 * @returns 
 */
function* arenaSwitchLoadAsyncScene({ arenaSwitchKey, asyncSceneBundle }) {
  let sceneBundle;
  try {
    sceneBundle = yield asyncSceneBundle;
  } finally {
    if (yield cancelled()) {
    }
  }
  yield put({
    type: SCENE_LOAD_END,
    sceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield* arenaSwitchSwitchScene({
    arenaSwitchKey,
    sceneBundle
  });
  return true;
}

/**
 * Listen to the loading of each scene,
 * and handle different processing functions when handling sence switches.
 * 
 * @param {any} ctx 
 */

function* forkSagaWithContext(ctx) {
  yield setContext(ctx);
  yield fork(function*() {
    let lastTask;
    while (true) {
      let action = yield take([
        ARENASWITCH_LOAD_ASYNCSCENE,
        ARENASWITCH_SWITCH_SCENE
      ]);
      if (action.arenaSwitchKey === ctx.arenaSwitchReducerKey) {
        if (lastTask && lastTask.isRunning()) {
          yield cancel(lastTask);
        }
        if (action.type === ARENASWITCH_LOAD_ASYNCSCENE) {
          lastTask = yield fork(arenaSwitchLoadAsyncScene, action);
        } else {
          lastTask = yield fork(arenaSwitchSwitchScene, action);
        }
      }
    }
  });
}

/**
 * It is used to initialize the ArenaSwitch layer.
 * 
 * @param {any} { reducerKey, setSagaTask } 
 */

function* initArenaSwitchSaga({ reducerKey, setSagaTask }) {
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

function* killArenaSwitchSaga({ sagaTaskPromise }) {
  let sagaTask = yield sagaTaskPromise;
  if (sagaTask) yield cancel(sagaTask);
}

export default function* saga() {
  yield takeEvery(ARENASWITCH_INIT_SAGA, initArenaSwitchSaga);
  yield takeEvery(ARENASWITCH_KILL_SAGA, killArenaSwitchSaga);
}
