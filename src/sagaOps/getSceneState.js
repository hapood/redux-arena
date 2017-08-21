import { select, getContext } from "redux-saga/effects";

export default function* getSceneState(sceneKey) {
  if (sceneKey == null) sceneKey = yield getContext("sceneKey");
  let a = yield select(state => state[sceneKey]);
  return yield select(state => state[sceneKey]);
}
