import { fork, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { SCENE_SET_STATE } from "../../src/redux/actionTypes";

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

function* dynamicState() {
  while (true) {
    yield delay(500);
    yield put({
      type: SCENE_SET_STATE,
      state: { dynamicState: randLetter() }
    });
  }
}
export default function* saga() {
  yield fork(dynamicState);
}
