import {
  SCENE_REPLACE_STATE,
  ARENASWITCH_REPLACE_STATE
} from "../redux/actionTypes";

export function switchReplaceReducer(store, reducerKey, reducerFactory, state) {
  let newReducerKey = store.replaceReducer({
    reducerKey,
    reducer: reducerFactory(reducerKey),
    state
  });
  if (state)
    store.dispatch({
      type: ARENASWITCH_REPLACE_STATE,
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
      type: SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  return reducerKey;
}
