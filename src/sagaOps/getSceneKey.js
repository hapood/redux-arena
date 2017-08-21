import { getContext } from "redux-saga/effects";

export default function* getSceneKey() {
  return yield getContext("sceneKey");
}
