/**
 * Create redux-arena proxy store
 */
import {
  createStore,
  combineReducers,
  Store,
  ReducersMapObject,
  GenericStoreEnhancer,
  Dispatch,
  Unsubscribe
} from "redux";
import { ForkEffect } from "redux-saga/effects";
import { ArenaState } from "../reducers/types";
import { SceneReducer } from "../types";

type ArenaStoreState = {
  arena: ArenaState;
};

export type ReducerObject = {
  reducerKey: string;
  reducer: SceneReducer<any>;
  state?: {} | null;
};

export interface EnhancedStore<S = {}> extends Store<S> {
  addSingleReducer: (reducerObject: ReducerObject) => boolean;
  removeSingleReducer: (reducerKey: string) => boolean;
  replaceSingleReducer: (reducerObject: ReducerObject) => boolean;
  close: () => void;
  runSaga: (saga: ForkEffect) => void;
}

function storeEnhancer<S extends ArenaStoreState>(
  store: Store<S>,
  reducers: ReducersMapObject
): EnhancedStore<S> {
  let _currentReducers = reducers;
  let handler = {
    get: function(target: Store<S>, name: string) {
      if (name === "addSingleReducer") {
        return ({ reducerKey, reducer }: ReducerObject) => {
          let allStates = target.getState();
          if (allStates.arena.stateTreeDict.get(reducerKey) != null)
            return false;
          _currentReducers = Object.assign({}, _currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(_currentReducers));
          return true;
        };
      }
      if (name === "removeSingleReducer") {
        return (reducerKey: string) => {
          if (reducerKey == null) {
            throw new Error("Can not remove reducerKey of null.");
          }
          let newReducers = Object.assign({}, _currentReducers);
          let allStates: any = target.getState();
          delete newReducers[reducerKey];
          _currentReducers = newReducers;
          delete allStates[reducerKey];
          target.replaceReducer(combineReducers(newReducers));
          return true;
        };
      }
      if (name === "replaceSingleReducer") {
        return ({ reducerKey, reducer }: ReducerObject) => {
          if (reducerKey == null)
            throw new Error(`reducerKey can not be null.`);
          let allStates = target.getState();
          if (_currentReducers[reducerKey] == null)
            throw new Error(`reducer for key [${reducerKey}] doesn't exsit.`);
          _currentReducers = Object.assign({}, _currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(_currentReducers));
          return reducerKey;
        };
      }
      return (target as any)[name];
    }
  };
  return new Proxy(store, handler) as any;
}

export default function createEnhancedStore(
  reducers: ReducersMapObject,
  initialState: any,
  enhencer: GenericStoreEnhancer
) {
  let store = createStore(combineReducers(reducers), initialState, enhencer);
  return storeEnhancer(store, reducers);
}
