import { ARENA_CURTAIN_SET_STATE } from "../actionTypes";
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
import { createPropsPicker } from "../enhancedRedux";
import { sceneApplyRedux, sceneUpdateRedux } from "./sceneReduxSaga";

/**
 * Scene of the synchronous load function, it does the following.
 * 1. load, add, replace reducer.
 * 2. Set the state of the corresponding scene.
 * 3. Run the corresponding scene of the saga, cancel the last scene of the task.
 * 4. Connect redux according to the incoming mapStateToProps and actions.
 * 
 * @param {any} { arenaReducerDict, sceneBundle } 
 */
export function* applySceneBundle({
  isInitial,
  parentArenaReducerDict,
  sceneBundle,
  notifyAction
}) {
  let arenaCurtainReducerKey = parentArenaReducerDict._arenaCurtain.reducerKey;
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene,
    arenaReducerDict
  } = yield select(state => state[arenaCurtainReducerKey]);
  let newReduxInfo;
  if (isInitial) {
    newReduxInfo = yield* sceneApplyRedux({
      parentArenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options || {}
    });
  } else {
    newReduxInfo = yield* sceneUpdateRedux({
      parentArenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options || {},
      curSceneBundle,
      reduxInfo
    });
  }
  yield put({
    type: ARENA_CURTAIN_SET_STATE,
    _reducerKey: arenaCurtainReducerKey,
    state: {
      reduxInfo: newReduxInfo
    }
  });
  let propsPicker = createPropsPicker(sceneBundle.propsPicker, newReduxInfo);
  let PlayingScene = connect(propsPicker)(sceneBundle.Component);
  let displayName =
    sceneBundle.Component.displayName ||
    sceneBundle.Component.name ||
    "Unknown";
  PlayingScene.displayName = `SceneConnect({reducerKey:${newReduxInfo.reducerKey},Component:${displayName}})`;
  let newArenaState = {
    PlayingScene,
    curSceneBundle: sceneBundle
  };
  yield put({
    type: ARENA_CURTAIN_SET_STATE,
    _reducerKey: arenaCurtainReducerKey,
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
  isInitial,
  parentArenaReducerDict,
  asyncSceneBundle,
  notifyAction
}) {
  let sceneBundle;
  try {
    sceneBundle = yield asyncSceneBundle;
  } finally {
    if (yield cancelled()) {
    }
  }
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield* applySceneBundle({
    isInitial,
    parentArenaReducerDict,
    sceneBundle,
    notifyAction
  });
  return true;
}
