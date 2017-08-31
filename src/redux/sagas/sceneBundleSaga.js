import { ARENA_SWITCH_SET_STATE, ARENA_SCENE_LOAD_END } from "../actionTypes";
import { ARENA_SWITCH_EVENT_LOADARENA_SCENE_CONTINUE } from "../../actionTypes";
import {
  take,
  put,
  fork,
  select,
  cancel,
  cancelled,
  getContext
} from "redux-saga/effects";
import { connect } from "react-redux";
import { createProxyMapStateToProps } from "../../enhencedRedux";
import { sceneApplyRedux } from "./sceneReduxSaga";

/**
 * Scene of the synchronous load function, it does the following.
 * 1. load, add, replace reducer.
 * 2. Set the state of the corresponding scene.
 * 3. Run the corresponding scene of the saga, cancel the last scene of the task.
 * 4. Connect redux according to the incoming mapStateToProps and actions.
 * 
 * @param {any} { arenaReducerDict, sceneBundle } 
 */
export function* applySceneBundle({ parentArenaReducerDict, sceneBundle }) {
  let arenaSwitchReducerKey = parentArenaReducerDict._curSwitch.reducerKey;
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene,
    isWaiting,
    arenaReducerDict
  } = yield select(state => state[arenaSwitchReducerKey]);
  let newReduxInfo = yield* sceneApplyRedux({
    parentArenaReducerDict,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    actions: sceneBundle.actions,
    reducer: sceneBundle.reducer,
    options: sceneBundle.options || {},
    curSceneBundle,
    reduxInfo
  });
  yield put({
    type: ARENA_SWITCH_SET_STATE,
    arenaSwitchReducerKey,
    state: {
      reduxInfo: newReduxInfo
    }
  });
  let mapStateToProps = createProxyMapStateToProps(
    sceneBundle.mapStateToProps,
    newReduxInfo,
    newReduxInfo.arenaReducerDict
  );
  let PlayingScene = connect(mapStateToProps)(sceneBundle.Component);
  let displayName =
    sceneBundle.Component.displayName ||
    sceneBundle.Component.name ||
    "Unknown";
  PlayingScene.displayName = `SceneConnect({reducerKey:${newReduxInfo.reducerKey},Component:${displayName}})`;
  let newArenaState = {
    PlayingScene,
    curSceneBundle: sceneBundle
  };
  if (isWaiting) {
    yield take(ARENA_SWITCH_EVENT_LOADARENA_SCENE_CONTINUE);
  }
  yield put({
    type: ARENA_SWITCH_SET_STATE,
    arenaSwitchReducerKey,
    state: newArenaState
  });
}

/**
 * The asynchronous loading function of the scene, 
 * and finally the synchronous load function
 * 
 * @param {any} { arenaReducerDict, asyncSceneBundle } 
 * @returns 
 */
export function* applyAsyncSceneBundle({
  parentArenaReducerDict,
  asyncSceneBundle
}) {
  let sceneBundle;
  try {
    sceneBundle = yield asyncSceneBundle;
  } finally {
    if (yield cancelled()) {
    }
  }
  yield put({
    type: ARENA_SCENE_LOAD_END,
    arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
    asyncSceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield* applySceneBundle({
    parentArenaReducerDict,
    sceneBundle
  });
  return true;
}
