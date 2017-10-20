import { fork, ForkEffect, take, Pattern } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _takeEverySceneAction(
  pattern: Pattern,
  saga: (...params: any[]) => any,
  key: string,
  args: any
) {
  while (true) {
    let action = yield take(pattern);
    let entry = yield getArenaReducerDictEntry(key);
    if (action._sceneReducerKey === entry.reducerKey) {
      yield fork(saga, ...args, action);
    }
  }
}

export default function takeEverySceneAction(
  pattern: Pattern,
  saga: (...params: any[]) => any,
  key?: string,
  ...args: any[]
) {
  return fork(
    _takeEverySceneAction,
    pattern,
    saga,
    key ? key : "_arenaScene",
    args
  );
}
