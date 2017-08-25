import { getContext } from "redux-saga/effects";

export default function* getSceneReducerKey() {
  return yield getContext("sceneReducerKey");
}
