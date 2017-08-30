import {
  SCENE_REPLACE_STATE,
  ARENASWITCH_REPLACE_STATE
} from "../redux/actionTypes";

export function sceneRmAndAddReducer(
  store,
  reducerKeyRemoved,
  reducerKeyAdded,
  reducerFactory
) {
  let oldState = store.getState()[reducerKeyRemoved];
  let newReducerKey = store.removeAndAddReducer({
    reducerKeyRemoved,
    reducerKeyAdded,
    reducer: reducerFactory(reducerKeyAdded),
    state
  });
  store.dispatch({
    type: SCENE_REPLACE_STATE,
    _sceneReducerKey: newReducerKey,
    state: state ? state : oldState
  });
  return reducerKey;
}

export function switchRmAndAddReducer(
  store,
  reducerKeyRemoved,
  reducerKeyAdded,
  reducerFactory
) {
  let oldState = store.getState()[reducerKeyRemoved];
  let newReducerKey = store.removeAndAddReducer({
    reducerKeyRemoved,
    reducerKeyAdded,
    reducer: reducerFactory(reducerKeyAdded),
    state
  });
  if (state)
    store.dispatch({
      type: ARENASWITCH_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state: state ? state : oldState
    });
  return reducerKey;
}
