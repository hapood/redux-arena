import { fork, put, take, call, cancel } from "redux-saga/effects";
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
  let letterTask;
  while (true) {
    let action = yield take("SWITCH_DYNAMIC_STATE");
    if (action.flag) {
      if (letterTask && letterTask.isRunning()) continue;
      letterTask = yield fork(setLetter, true);
    } else if (!action.flag && letterTask) {
      yield cancel(letterTask);
    }
  }
}
function* setLetter(flag) {
  do {
    yield fork(setSceneState, { dynamicState: randLetter() });
    yield delay(500);
  } while (flag);
}

function* switchDanymicState({ flag }) {
  yield* setSceneState({
    isDynamicStateEnable: flag
  });
}

export default function* saga() {
  yield fork(dynamicState);
  yield put({
    type: "SWITCH_DYNAMIC_STATE",
    flag: true
  });
  yield takeLatest("SWITCH_DYNAMIC_STATE", sceneActionSaga(switchDanymicState));
}
