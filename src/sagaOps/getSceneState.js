import { select } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

export default function* getSceneState(key = "_curScene") {
  let entry = yield* getArenaReducerDictEntry(key);
  return yield select(state => state[entry.reducerKey]);
}
