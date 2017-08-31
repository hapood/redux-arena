import { put } from "redux-saga/effects";
import getSceneEntry from "./getSceneEntry";
import { ARENA_SCENE_SET_STATE } from "../redux/actionTypes";

export default function* setSceneState(state, key) {
  let entry = yield* getSceneEntry(key);
  yield put({
    type: ARENA_SCENE_SET_STATE,
    _sceneReducerKey: entry.reducerKey,
    state
  });
}
