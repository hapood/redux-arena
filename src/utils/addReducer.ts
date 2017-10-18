import { actionTypes } from "../core/actionTypes";
import { EhancedStore, SceneReducer, ReducerFactory } from "../core";

function addReducer(
  store: EhancedStore<any>,
  reducerKey: string,
  reducerFactory: ReducerFactory
) {
  let newReducerKey: string | null = reducerKey;
  if (newReducerKey != null) {
    let flag = store.addReducer({
      reducerKey: newReducerKey,
      reducer: reducerFactory(newReducerKey)
    });
    if (flag === false) {
      throw new Error(`Reducer key [${newReducerKey}] already exsit.`);
    }
  } else {
    do {
      newReducerKey = String(Math.random()).slice(2);
      let flag = store.addReducer({
        reducerKey: newReducerKey,
        reducer: reducerFactory(newReducerKey)
      });
      if (flag === false) newReducerKey = null;
    } while (newReducerKey == null);
  }
  return newReducerKey;
}

export function sceneAddReducer(
  store: EhancedStore<any>,
  reducerKey: string,
  reducerFactory: ReducerFactory,
  state: any
) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: actionTypes.ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}

export function curtainAddReducer(
  store: EhancedStore<any>,
  reducerKey: string,
  reducerFactory: ReducerFactory,
  state: any
) {
  let newReducerKey = addReducer(store, reducerKey, reducerFactory);
  if (state)
    store.dispatch({
      type: actionTypes.ARENA_CURTAIN_REPLACE_STATE,
      _reducerKey: newReducerKey,
      state
    });
  return newReducerKey;
}
