import {
  ARENA_SWITCH_SCENE,
  ARENA_SET_STATE,
  SCENE_REPLACE_STATE,
  SCENE_LOAD_END,
  ARENA_LOAD_ASYNCSCENE
} from "../actionTypes";
import { takeLatest, take, put, call, fork, select } from "redux-saga/effects";
import createSenceReducer from "../reducers/createSenceReducer";

function* sceneApplyRedux({ state, saga, reducer }) {
  window.arenaStore.replaceReducer(
    reducer ? { scene: createSenceReducer(reducer) } : {}
  );
  if (saga) yield fork(saga);
  yield put({
    type: SCENE_REPLACE_STATE,
    state
  });
}

function* arenaLoadScene({
  sceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
}) {
  let newArenaState = {
    match: sceneBundle.match,
    location: sceneBundle.location,
    PlayingScene: sceneBundle.Component,
    sceneNo: OldPlayingScene === sceneBundle.Component ? sceneNo + 1 : 0
  };
  yield* sceneApplyRedux({
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer
  });
  yield put({ type: ARENA_SET_STATE, state: newArenaState });
}

function* arenaLoadAsyncScene({
  asyncSceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
}) {
  let sceneBundle = yield asyncSceneBundle;
  yield put({
    type: SCENE_LOAD_END,
    match,
    location,
    asyncSceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield put({
    type: ARENA_SWITCH_SCENE,
    sceneBundle,
    match,
    location,
    OldPlayingScene,
    sceneNo
  });
}

export default function* saga() {
  yield takeLatest(ARENA_SWITCH_SCENE, arenaLoadScene);
  yield takeLatest(ARENA_LOAD_ASYNCSCENE, arenaLoadAsyncScene);
}
