import { call, put } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _putSceneAction(action, key) {
  let entry = yield getArenaReducerDictEntry(key);
  let newAction = Object.assign({}, action, {
    _sceneReducerKey: entry.reducerKey
  });
  yield put(newAction);
}

function* _putSceneActionResolve(actionPromise, key) {
  let action = yield actionPromise;
  let entry = yield getArenaReducerDictEntry(key);
  let newAction = Object.assign({}, action, {
    _sceneReducerKey: entry.reducerKey
  });
  yield put(newAction);
}

const putSceneAction = function(action, key = "_arenaScene") {
  return call(_putSceneAction, action, key);
};

putSceneAction.resolve = function(actionPromise, key = "_arenaScene") {
  return call(_putSceneActionResolve, actionPromise, key);
};

export default putSceneAction;
