import { fork, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { setSceneState } from "redux-arena/sagaOps";

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
    yield* setSceneState({
      dynamicState: randLetter()
    });
  }
}
export default function* saga() {
  yield fork(dynamicState);
}
