import {
  ARENA_SCENE_REPLACE_STATE,
  ARENA_CURTAIN_REPLACE_STATE,
  ARENA_GLOBAL_PROPSPICKER_LOCK
} from "../core/actionTypes";

export function sceneRmAndAddReducer(
  store,
  reducerKeyRemoved,
  reducerKeyAdded,
  reducerFactory,
  state
) {
  store.dispatch({
    type: ARENA_GLOBAL_PROPSPICKER_LOCK,
    lock: true
  });
  let newReducerKey = store.removeAndAddReducer({
    reducerKeyRemoved,
    reducerKeyAdded,
    reducer: reducerFactory(reducerKeyAdded),
    state
  });
  if (state) {
    store.dispatch({
      type: ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state: state
    });
  }
  store.dispatch({
    type: ARENA_GLOBAL_PROPSPICKER_LOCK,
    lock: false
  });
  return newReducerKey;
}
