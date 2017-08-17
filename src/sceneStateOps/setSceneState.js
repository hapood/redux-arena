import { put, getContext } from "redux-saga/effects";
import { SCENE_SET_STATE } from "../redux/actionTypes";

export default function* setSceneState(state) {
  let sceneKey = yield getContext("sceneKey");
  yield put({
    type: SCENE_SET_STATE,
    _sceneKey: sceneKey,
    state
  });
}
