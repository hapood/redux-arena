import {
  ARENA_LOAD_SCENE,
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
  SceneComponent,
  state,
  saga,
  reducer,
  match,
  location,
  OldPlayingScene,
  sceneNo
}) {
  let newArenaState = {
    match,
    location,
    PlayingScene: SceneComponent,
    sceneNo: OldPlayingScene === SceneComponent ? sceneNo + 1 : 0
  };
  yield* sceneApplyRedux({ state, saga, reducer });
  yield put({ type: ARENA_SET_STATE, state: newArenaState });
  yield put({ type: SCENE_LOAD_END });
}

function* arenaLoadAsyncScene({
  asyncSceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
}) {
  let sceneBundle = yield asyncSceneBundle;
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield put({
    type: ARENA_LOAD_SCENE,
    SceneComponent: sceneBundle.Component,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    match,
    location,
    OldPlayingScene,
    sceneNo
  });
}

export default function* saga() {
  yield takeLatest(ARENA_LOAD_SCENE, arenaLoadScene);
  yield takeLatest(ARENA_LOAD_ASYNCSCENE, arenaLoadAsyncScene);
}
