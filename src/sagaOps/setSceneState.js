import { put } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";
import { ARENA_SCENE_SET_STATE } from "../redux/actionTypes";

export default function* setSceneState(state, key) {
  let entry = yield* getArenaReducerDictEntry(key || "_curScene");
  yield put({
    type: ARENA_SCENE_SET_STATE,
    _sceneReducerKey: entry.reducerKey,
    state
  });
}
