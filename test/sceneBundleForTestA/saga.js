import { fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import {
  setSceneState,
  getSceneState,
  takeLatestSceneAction,
  takeEverySceneAction,
  takeSceneAction,
  putSceneAction,
  getSceneActions
} from "../../src/effects";

function* addSagaCnt() {
  let { sagaCnt } = yield getSceneState();
  yield setSceneState({ sagaCnt: sagaCnt + 1 });
}

function* addCntBySaga() {
  while (true) {
    yield takeSceneAction("ADD_CNT_BY_SAGA");
    yield putSceneAction({ type: "ADD_CNT" });
  }
}

function* addCntBySagaMaybe() {
  while (true) {
    yield takeSceneAction.maybe("ADD_CNT_BY_SAGA");
    yield putSceneAction.resolve(Promise.resolve({ type: "ADD_CNT" }));
  }
}

function* sceneActionForward() {
  let { addCnt } = yield getSceneActions();
  addCnt();
}

export default function* saga() {
  yield takeLatestSceneAction("ADD_SAGA_CNT", addSagaCnt);
  yield takeEverySceneAction("ADD_CNT_BY_SAGA", sceneActionForward);
  yield fork(addCntBySaga);
  yield fork(addCntBySagaMaybe);
}
