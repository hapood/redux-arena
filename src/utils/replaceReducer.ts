import { ActionTypes } from "../core/ActionTypes";

export function sceneReplaceReducer(store, reducerKey, reducerFactory, state) {
  store.dispatch({
    type: ActionTypes.ARENA_GLOBAL_PROPSPICKER_LOCK,
    lock: true
  });
  let newReducerKey = store.replaceReducer({
    reducerKey,
    reducer: reducerFactory(reducerKey),
    state
  });
  if (state)
    store.dispatch({
      type: ActionTypes.ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  store.dispatch({
    type: ActionTypes.ARENA_GLOBAL_PROPSPICKER_LOCK,
    lock: false
  });
  return reducerKey;
}
