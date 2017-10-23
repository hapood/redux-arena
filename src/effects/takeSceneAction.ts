import { take, call, CallEffect, Pattern } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";
import { END } from "redux-saga";

function* _takeSceneAction(pattern: Pattern, key: string) {
  while (true) {
    let action = yield take(pattern);
    let entry = yield getArenaReducerDictEntry(key);
    if (action._sceneReducerKey === entry.reducerKey) {
      return action;
    }
  }
}

function* _takeSceneActionMaybe(pattern: Pattern, key: string) {
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

export type TakeSceneAction = {
  (pattern: Pattern, key?: string): void;
  maybe: (pattern: Pattern, key?: string) => void;
};

const takeSceneAction: any = function(pattern: Pattern, key?: string) {
  return call(_takeSceneAction, pattern, key ? key : "_arenaScene");
};

takeSceneAction.maybe = function(pattern: Pattern, key?: string) {
  return call(_takeSceneActionMaybe, pattern, key ? key : "_arenaScene");
};

export default <TakeSceneAction>takeSceneAction;
