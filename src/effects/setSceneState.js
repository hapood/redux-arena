import { put, call } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";
import { ARENA_SCENE_SET_STATE } from "../core/actionTypes";

function* _setSceneState(state, key) {
  let entry = yield getArenaReducerDictEntry(key);
  yield put({
    type: ARENA_SCENE_SET_STATE,
    _sceneReducerKey: entry.reducerKey,
    state
  });
}

export default function setSceneState(state, key = "_arenaScene") {
  return call(_setSceneState, state, key);
}
