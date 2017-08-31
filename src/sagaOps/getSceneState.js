import { select } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

export default function* getSceneState(key) {
  let entry = yield* getArenaReducerDictEntry(key || "_curScene");
  return yield select(state => state[entry.reducerKey]);
}
