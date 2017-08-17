import { fork, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { setSceneState } from "../../src/sceneStateOps";

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
    yield* setSceneState({
      dynamicState: randLetter()
    });
  }
}
export default function* saga() {
  yield fork(dynamicState);
}
