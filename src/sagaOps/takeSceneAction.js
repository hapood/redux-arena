import { take } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";
import { END } from "redux-saga";

const takeSceneAction = function*(pattern, key = "_curScene") {
  while (true) {
    let action = yield take(pattern);
    let entry = yield* getArenaReducerDictEntry(key);
    if (action._sceneReducerKey === entry.reducerKey) {
      return action;
    }
  }
};

takeSceneAction.maybe = function*(pattern, key = "_curScene") {
  while (true) {
    let action = yield take.maybe(pattern);
    let entry = yield* getArenaReducerDictEntry(key);
    if (
      action._sceneReducerKey === entry.reducerKey ||
      action.type === END.type
    ) {
      return action;
    }
  }
};

export default takeSceneAction;
