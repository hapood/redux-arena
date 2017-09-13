import { fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import {
  setSceneState,
  getSceneState,
  takeLatestSceneAction
} from "redux-arena/effects";

function randLetter() {
  var letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  var letter = letters[Math.floor(Math.random() * letters.length)];
  return letter;
}

function* setLetter() {
  while (true) {
    yield setSceneState({ dynamicState: randLetter() });
    yield delay(500);
  }
}

function* switchDanymicState({ flag }) {
  let { isDynamicStateEnable } = yield getSceneState();
  if (flag) {
    yield fork(setLetter);
  }
  yield setSceneState({
    isDynamicStateEnable: flag
  });
}

export default function* saga() {
  yield takeLatestSceneAction("SWITCH_DYNAMIC_STATE", switchDanymicState);
}
