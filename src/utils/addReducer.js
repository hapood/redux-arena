import {
  ARENA_SCENE_REPLACE_STATE,
  ARENA_CURTAIN_REPLACE_STATE
} from "../core/actionTypes";

function addReducer(store, reducerKey, reducerFactory) {
  let newReducerKey = reducerKey;
  if (newReducerKey != null) {
    let flag = store.addReducer({
      reducerKey: newReducerKey,
      reducer: reducerFactory(newReducerKey)
    });
    if (flag === false) {
      throw new Error(`Reducer key [${newReducerKey}] already exsit.`);
    }
  } else {
    do {
      newReducerKey = String(Math.random()).slice(2);
      let flag = store.addReducer({
        reducerKey: newReducerKey,
        reducer: reducerFactory(newReducerKey)
      });
      if (flag === false) newReducerKey = null;
    } while (newReducerKey == null);
  }
  return newReducerKey;
}

export function sceneAddReducer(store, reducerKey, reducerFactory, state) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}

export function curtainAddReducer(store, reducerKey, reducerFactory, state) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: ARENA_CURTAIN_REPLACE_STATE,
      _reducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}
