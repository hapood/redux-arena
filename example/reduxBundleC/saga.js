import { fork, put } from "redux-saga/effects";
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

function* dynamicState() {
  while (true) {
    yield delay(500);
    let { isDynamicStateEnable } = yield* getSceneState();
    if (isDynamicStateEnable) {
      yield* setSceneState({
        dynamicState: randLetter()
      });
    }
  }
}

function* switchDanymicState({ flag }) {
  yield* setSceneState({
    isDynamicStateEnable: flag
  });
}

export default function* saga() {
  yield fork(dynamicState);
  yield takeLatest("SWITCH_DYNAMIC_STATE", sceneActionSaga(switchDanymicState));
}
