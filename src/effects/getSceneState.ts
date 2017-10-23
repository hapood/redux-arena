import { select, call, CallEffect } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _getSceneState(key: string) {
  let entry = yield getArenaReducerDictEntry(key);
  return yield select((state: any) => state[entry.reducerKey]);
}

export default function getSceneState(key?: string) {
  return call(_getSceneState, key ? key : "_arenaScene");
}
