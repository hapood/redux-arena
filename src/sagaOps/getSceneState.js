import { select, getContext } from "redux-saga/effects";

export default function* getSceneState(sceneReducerKey) {
  if (sceneReducerKey == null) sceneReducerKey = yield getContext("sceneReducerKey");
  let a = yield select(state => state[sceneReducerKey]);
  return yield select(state => state[sceneReducerKey]);
}
