import { select } from "redux-saga/effects";
import getSceneEntry from "./getSceneEntry";

export default function* getSceneState(key) {
  let entry = yield* getSceneEntry(key);
  return yield select(state => state[entry.reducerKey]);
}
