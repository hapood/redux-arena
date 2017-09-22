import { take, call } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";
import { END } from "redux-saga";

function* _takeSceneAction(pattern, key) {
  while (true) {
    let action = yield take(pattern);
    let entry = yield getArenaReducerDictEntry(key);
    if (action._sceneReducerKey === entry.reducerKey) {
      return action;
    }
  }
}

function* _takeSceneActionMaybe(pattern, key) {
  while (true) {
    let action = yield take.maybe(pattern);
    let entry = yield getArenaReducerDictEntry(key);
    if (
      action._sceneReducerKey === entry.reducerKey ||
      action.type === END.type
    ) {
      return action;
    }
  }
}

const takeSceneAction = function(pattern, key = "_arenaScene") {
  return call(_takeSceneAction, pattern, key);
};

takeSceneAction.maybe = function(pattern, key = "_arenaScene") {
  return call(_takeSceneActionMaybe, pattern, key);
};

export default takeSceneAction;
