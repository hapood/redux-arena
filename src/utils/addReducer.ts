import ActionTypes from "../core/ActionTypes";
import { EnhancedStore, SceneReducer, ReducerFactory } from "../core";

function addReducer(
  store: EnhancedStore<any>,
  reducerKey: string | null | undefined,
  reducerFactory: ReducerFactory
) {
  let newReducerKey = reducerKey;
  if (newReducerKey != null) {
    let flag = store.addSingleReducer({
      reducerKey: newReducerKey,
      reducer: reducerFactory(newReducerKey)
    });
    if (flag === false) {
      throw new Error(`Reducer key [${newReducerKey}] already exsit.`);
    }
  } else {
    do {
      newReducerKey = String(Math.random()).slice(2);
      let flag = store.addSingleReducer({
        reducerKey: newReducerKey,
        reducer: reducerFactory(newReducerKey)
      });
      if (flag === false) newReducerKey = null;
    } while (newReducerKey == null);
  }
  return newReducerKey;
}

export function sceneAddReducer(
  store: EnhancedStore<any>,
  reducerKey: string | null | undefined,
  reducerFactory: ReducerFactory,
  state?: any
) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: ActionTypes.ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}

export function curtainAddReducer(
  store: EnhancedStore<any>,
  reducerKey: string | null | undefined,
  reducerFactory: ReducerFactory,
  state?: any
) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: ActionTypes.ARENA_CURTAIN_REPLACE_STATE,
      _reducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}
