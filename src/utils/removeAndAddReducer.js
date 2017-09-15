import {
  ARENA_SCENE_REPLACE_STATE,
  ARENA_SWITCH_REPLACE_STATE,
  ARENA_CURTAIN_REPLACE_STATE
} from "../core/actionTypes";

export function sceneRmAndAddReducer(
  store,
  reducerKeyRemoved,
  reducerKeyAdded,
  reducerFactory,
  state
) {
  let newReducerKey = store.removeAndAddReducer({
    reducerKeyRemoved,
    reducerKeyAdded,
    reducer: reducerFactory(reducerKeyAdded),
    state
  });
  store.dispatch({
    type: ARENA_SCENE_REPLACE_STATE,
    _sceneReducerKey: newReducerKey,
    state: state
  });
  return newReducerKey;
}

export function switchRmAndAddReducer(
  store,
  reducerKeyRemoved,
  reducerKeyAdded,
  reducerFactory,
  state
) {
  let newReducerKey = store.removeAndAddReducer({
    reducerKeyRemoved,
    reducerKeyAdded,
    reducer: reducerFactory(reducerKeyAdded),
    state
  });
  if (state)
    store.dispatch({
      type: ARENA_SWITCH_REPLACE_STATE,
      _reducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}

export function curtainRmAndAddReducer(
  store,
  reducerKeyRemoved,
  reducerKeyAdded,
  reducerFactory,
  state
) {
  let newReducerKey = store.removeAndAddReducer({
    reducerKeyRemoved,
    reducerKeyAdded,
    reducer: reducerFactory(reducerKeyAdded),
    state
  });
  if (state)
    store.dispatch({
      type: ARENA_CURTAIN_REPLACE_STATE,
      _reducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}
