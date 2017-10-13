import { ARENA_CURTAIN_SET_STATE } from "../actionTypes";
import { put, select } from "redux-saga/effects";
import { connect } from "react-redux";
import { createPropsPicker } from "../enhancedRedux";
import { sceneApplyRedux, sceneUpdateRedux } from "./sceneReduxSaga";
import {
  ARENA_STATETREE_NODE_DISABLE,
  ARENA_STATETREE_NODE_DELETE
} from "../actionTypes";

/**
 * Scene of the synchronous load function, it does the following.
 * 1. load, add, replace reducer.
 * 2. Set the state of the corresponding scene.
 * 3. Run the corresponding scene of the saga, cancel the last scene of the task.
 * 4. Connect redux according to the incoming mapStateToProps and actions.
 * 
 * @param {any} { isInitial, arenaReducerDict, sceneBundle } 
 */
export function* applySceneBundle({
  isInitial,
  arenaReducerDict,
  sceneBundle,
  loadedCb
}) {
  let arenaCurtainReducerKey = arenaReducerDict._arenaCurtain.reducerKey;
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene,
    mutableObj
  } = yield select(state => state[arenaCurtainReducerKey]);
  mutableObj.isObsolete = true;
  let newReduxInfo;
  if (isInitial) {
    newReduxInfo = yield* sceneApplyRedux({
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options || {}
    });
  } else {
    newReduxInfo = yield* sceneUpdateRedux({
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options || {},
      curSceneBundle,
      reduxInfo
    });
  }
  let newMutableObj = { isObsolete: false };
  yield put({
    type: ARENA_CURTAIN_SET_STATE,
    _reducerKey: arenaCurtainReducerKey,
    state: {
      reduxInfo: newReduxInfo,
      mutableObj: newMutableObj
    }
  });
  let propsPicker = createPropsPicker(
    sceneBundle.propsPicker,
    newReduxInfo,
    newMutableObj
  );
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
  loadedCb();
  if (
    newReduxInfo.reducerKey !== reduxInfo.reducerKey &&
    reduxInfo.reducerKey !== null
  ) {
    let arenaStore = yield getContext("store");
    yield put({
      type: ARENA_STATETREE_NODE_DISABLE,
      reducerKey: reduxInfo.reducerKey
    });
    arenaStore.remove(reduxInfo.reducerKey);
    yield put({
      type: ARENA_STATETREE_NODE_DELETE,
      reducerKey: reduxInfo.reducerKey
    });
  }
}
