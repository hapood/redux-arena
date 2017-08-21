import { select, getContext } from "redux-saga/effects";

export default function* getSceneState() {
  let sceneKey = yield getContext("sceneKey");
  return yield select(state => state[sceneKey]);
}
