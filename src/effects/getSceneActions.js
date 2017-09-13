import { call } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _getSceneActions(key) {
  let entry = yield getArenaReducerDictEntry(key);
  return entry.actions;
}

export default function getSceneActions(key = "_curScene") {
  return call(_getSceneActions, key);
}
