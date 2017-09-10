import { fork, take, cancel } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _takeLatestSceneAction(pattern, saga, key, args) {
  let lastTask;
  while (true) {
    let action = yield take(pattern);
    let entry = yield* getArenaReducerDictEntry(key);
    if (action._sceneReducerKey === entry.reducerKey) {
      if (lastTask) yield cancel(lastTask);
      lastTask = yield fork(saga, ...args, action);
    }
  }
}

export default function* takeLatestSceneAction(
  pattern,
  saga,
  key = "_curScene",
  ...args
) {
  yield fork(_takeLatestSceneAction, pattern, saga, key, args);
}
