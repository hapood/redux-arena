import { put, getContext } from "redux-saga/effects";
import { SCENE_SET_STATE } from "../redux/actionTypes";

export default function* setSceneState(state) {
  let sceneReducerKey = yield getContext("sceneReducerKey");
  yield put({
    type: SCENE_SET_STATE,
    _sceneReducerKey: sceneReducerKey,
    state
  });
}
