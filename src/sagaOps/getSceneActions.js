import { select } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

export default function* getSceneActions(key = "_curScene") {
  let entry = yield* getArenaReducerDictEntry(key);
  return entry.actions;
}
