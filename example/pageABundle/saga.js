import { fork, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { SCENE_SET_STATE } from "../../src/redux/actionTypes";

function* dynamicState() {
  while (true) {
    yield delay(500);
    yield put({
      type: SCENE_SET_STATE,
      state: { dynamicState: Math.floor(Math.random() * 100) }
    });
  }
}
export default function* saga() {
  yield fork(dynamicState);
}
