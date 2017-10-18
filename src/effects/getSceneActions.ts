import { call, CallEffect } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _getSceneActions(key: string) {
  let entry = yield getArenaReducerDictEntry(key);
  return entry.actions;
}

export default function getSceneActions(key: string = "_arenaScene") {
  return call(_getSceneActions, key);
}
