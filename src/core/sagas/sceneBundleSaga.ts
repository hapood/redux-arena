import {
  call,
  put,
  select,
  getContext,
  GetContextEffect,
  CallEffect,
  PutEffect,
  SelectEffect
} from "redux-saga/effects";
import { connect } from "react-redux";
import { createPropsPicker } from "../enhancedRedux";
import { sceneApplyRedux, sceneUpdateRedux } from "./sceneReduxSaga";
import ActionTypes from "../ActionTypes";
import { CurtainState, CurtainReduxInfo } from "../reducers/types";
import { SceneBundle, CurtainLoadSceneAction } from "../types";

export function* applySceneBundle({
  isInitial,
  arenaReducerDict,
  sceneBundle,
  loadedCb
}: CurtainLoadSceneAction) {
  let arenaCurtainReducerKey = arenaReducerDict._arenaCurtain.reducerKey;
  let curtainState: CurtainState = yield select(
    (state: any) => state[arenaCurtainReducerKey]
  );
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene,
    mutableObj
  } = curtainState;
  mutableObj.isObsolete = true;
  let newReduxInfo: CurtainReduxInfo;
  if (isInitial) {
    newReduxInfo = yield* sceneApplyRedux({
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options
    });
  } else {
    newReduxInfo = yield* sceneUpdateRedux({
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options,
      curSceneBundle: curSceneBundle as SceneBundle,
      reduxInfo: reduxInfo as CurtainReduxInfo
    });
  }
  let newMutableObj = { isObsolete: false };
  yield put({
    type: ActionTypes.ARENA_CURTAIN_SET_STATE,
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
    type: ActionTypes.ARENA_CURTAIN_SET_STATE,
    _reducerKey: arenaCurtainReducerKey,
    state: newArenaState
  });
  loadedCb();
  if (
    reduxInfo != null &&
    newReduxInfo.reducerKey !== reduxInfo.reducerKey &&
    reduxInfo.reducerKey != null
  ) {
    let arenaStore = yield getContext("store");
    yield put({
      type: ActionTypes.ARENA_STATETREE_NODE_DISABLE,
      reducerKey: reduxInfo.reducerKey
    });
    arenaStore.removeSingleReducer(reduxInfo.reducerKey);
    yield put({
      type: ActionTypes.ARENA_STATETREE_NODE_DELETE,
      reducerKey: reduxInfo.reducerKey
    });
  }
}
