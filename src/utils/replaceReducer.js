import {
  ARENA_SCENE_REPLACE_STATE,
  ARENA_SWITCH_REPLACE_STATE
} from "../core/actionTypes";

export function switchReplaceReducer(store, reducerKey, reducerFactory, state) {
  let newReducerKey = store.replaceReducer({
    reducerKey,
    reducer: reducerFactory(reducerKey),
    state
  });
  if (state)
    store.dispatch({
      type: ARENA_SWITCH_REPLACE_STATE,
      arenaSwitchReducerKey: newReducerKey,
      state
    });
  return reducerKey;
}

export function sceneReplaceReducer(store, reducerKey, reducerFactory, state) {
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
  return reducerKey;
}
