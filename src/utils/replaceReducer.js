import {
  ARENA_SCENE_REPLACE_STATE,
} from "../core/actionTypes";

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
