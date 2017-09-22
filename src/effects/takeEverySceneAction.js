import { fork, take } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _takeEverySceneAction(pattern, saga, key, args) {
  while (true) {
    let action = yield take(pattern);
    let entry = yield getArenaReducerDictEntry(key);
    if (action._sceneReducerKey === entry.reducerKey) {
      yield fork(saga, ...args, action);
    }
  }
}

export default function takeEverySceneAction(
  pattern,
  saga,
  key = "_arenaScene",
  ...args
) {
  return fork(_takeEverySceneAction, pattern, saga, key, args);
}
