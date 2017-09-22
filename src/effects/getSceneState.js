import { select, call } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _getSceneState(key) {
  let entry = yield getArenaReducerDictEntry(key);
  return yield select(state => state[entry.reducerKey]);
}

export default function getSceneState(key = "_arenaScene") {
  return call(_getSceneState, key);
}
