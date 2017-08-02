import {
  ARENA_SCENE_SWITCH,
  ARENA_SET_STATE,
  SCENE_REPLACE_STATE
} from "../actionTypes";
import { takeLatest, take, put, call, fork, select } from "redux-saga/effects";

function* sceneApplyRedux({ reducer, saga, state }) {
  window.arenaStore.replaceReducer(reducer ? { scene: reducer } : {});
  if (saga) yield fork(saga);
  yield put({
    type: SCENE_REPLACE_STATE,
    state
  });
}

function* sceneSwitch({
  state,
  reducer,
  saga,
  match,
  location,
  SceneComponent,
  isSameScene
}) {
  let { sceneNo } = yield select(state => state.arena);
  let newArenaState = {
    match,
    location,
    PlayingScene: SceneComponent,
    sceneNo: isSameScene ? sceneNo + 1 : 0
  };
  yield* sceneApplyRedux({ reducer, saga, state });
  yield put({ type: ARENA_SET_STATE, state: newArenaState });
}

export default function* saga() {
  yield takeLatest(ARENA_SCENE_SWITCH, sceneSwitch);
}
