import { put } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";
import { ARENA_SCENE_SET_STATE } from "../core/actionTypes";

export default function* setSceneState(state, key = "_curScene") {
  let entry = yield* getArenaReducerDictEntry(key);
  yield put({
    type: ARENA_SCENE_SET_STATE,
    _sceneReducerKey: entry.reducerKey,
    state
  });
}
