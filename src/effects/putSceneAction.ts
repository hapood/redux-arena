import { AnyAction } from "redux";
import { call, CallEffect, put } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _putSceneAction(action: AnyAction, key: string) {
  let entry = yield getArenaReducerDictEntry(key);
  let newAction = Object.assign({}, action, {
    _sceneReducerKey: entry.reducerKey
  });
  yield put(newAction);
}

export type PutSceneAction = {
  (action: AnyAction, key?: string): void;
};

const putSceneAction: any = function(action: AnyAction, key?: string) {
  return call(_putSceneAction, action, key ? key : "_arenaScene");
};

export default <PutSceneAction>putSceneAction;
