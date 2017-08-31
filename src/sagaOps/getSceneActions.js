import { select } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

export default function* getSceneActions(key) {
  let entry = yield* getArenaReducerDictEntry(key || "_curScene");
  return entry.actions;
}
