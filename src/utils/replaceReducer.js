import {
  ARENA_SCENE_REPLACE_STATE,
  ARENA_GLOBAL_PROPSPICKER_LOCK
} from "../core/actionTypes";

export function sceneReplaceReducer(store, reducerKey, reducerFactory, state) {
  store.dispatch({
    type: ARENA_GLOBAL_PROPSPICKER_LOCK,
    lock: true
  });
  let newReducerKey = store.replaceReducer({
    reducerKey,
    reducer: reducerFactory(reducerKey),
    state
  });
  if (state)
    store.dispatch({
      type: ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  store.dispatch({
    type: ARENA_PROPSPICKER_UNLOCK,
    lock: false
  });
  return reducerKey;
}
