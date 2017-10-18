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
import { actionTypes } from "../actionTypes";
import { CurtainState } from "../reducers/types";
import { SceneBundle, LoadSceneAction } from "../types";

export function* applySceneBundle({
  isInitial,
  arenaReducerDict,
  sceneBundle,
  loadedCb
}: LoadSceneAction) {
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
  let newReduxInfo;
  if (isInitial) {
    newReduxInfo = yield call(sceneApplyRedux, {
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options
    });
  } else {
    newReduxInfo = yield call(sceneUpdateRedux, {
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options,
      curSceneBundle: curSceneBundle,
      reduxInfo
    });
  }
  let newMutableObj = { isObsolete: false };
  yield put({
    type: actionTypes.ARENA_CURTAIN_SET_STATE,
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
    type: actionTypes.ARENA_CURTAIN_SET_STATE,
    _reducerKey: arenaCurtainReducerKey,
    state: newArenaState
  });
  loadedCb();
  if (
    reduxInfo !== null &&
    newReduxInfo.reducerKey !== reduxInfo.reducerKey &&
    reduxInfo.reducerKey != null
  ) {
    let arenaStore = yield getContext("store");
    yield put({
      type: actionTypes.ARENA_STATETREE_NODE_DISABLE,
      reducerKey: reduxInfo.reducerKey
    });
    arenaStore.removeReducer(reduxInfo.reducerKey);
    yield put({
      type: actionTypes.ARENA_STATETREE_NODE_DELETE,
      reducerKey: reduxInfo.reducerKey
    });
  }
}
