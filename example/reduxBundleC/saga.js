import { fork } from "redux-saga/effects";
import { delay, takeLatest } from "redux-saga";
import { setSceneState, getSceneState } from "../../src/sagaOps";
import { sceneActionSaga } from "../../src/sceneScope";

function randLetter() {
  var letters = [
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+"
  ];
  var letter = letters[Math.floor(Math.random() * letters.length)];
  return letter;
}

function* setLetter() {
  while (true) {
    yield* setSceneState({ dynamicState: randLetter() });
    yield delay(500);
  }
}

function* switchDanymicState({ flag }) {
  let { isDynamicStateEnable } = yield* getSceneState();
  if (isDynamicStateEnable !== flag) {
    if (flag) {
      yield fork(setLetter);
    }
  }
  yield* setSceneState({
    isDynamicStateEnable: flag
  });
}

export default function* saga() {
  yield takeLatest("SWITCH_DYNAMIC_STATE", sceneActionSaga(switchDanymicState));
}
