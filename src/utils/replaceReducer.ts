import ActionTypes from "../core/ActionTypes";
import { EnhancedStore, SceneReducer } from "../core";
export function sceneReplaceReducer(
  store: EnhancedStore,
  reducerKey: string,
  reducerFactory: (reducerKey: string) => SceneReducer<{}>,
  state: {} | null | undefined
) {
  store.dispatch({
    type: ActionTypes.ARENA_GLOBAL_PROPSPICKER_LOCK,
    lock: true
  });
  let newReducerKey = store.replaceSingleReducer({
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
