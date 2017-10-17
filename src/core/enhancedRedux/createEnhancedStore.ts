/**
 * Create redux-arena proxy store
 */
import {
  createStore,
  combineReducers,
  Reducer,
  Store,
  ReducersMapObject,
  GenericStoreEnhancer,
  Dispatch,
  Unsubscribe
} from "redux";
import { ArenaState } from "../reducers/getArenaInitState";

type ArenaStoreState = {
  arena: ArenaState;
};

type ReducerTuple = { reducerKey: string; reducer: Reducer<any> };

export interface EhencedStore<S> {
  addReducer: (ReducerTuple) => boolean;
  removeReducer: (string) => boolean;
  replaceReducer: (ReducerTuple) => boolean;
  close: () => void;
  runSaga: (saga: () => Iterator<any>) => void;
  dispatch: Dispatch<S>;
  getState(): S;
  subscribe(listener: () => void): Unsubscribe;
}

function storeEnhancer<S extends ArenaStoreState>(
  store: Store<S>,
  reducers: ReducersMapObject
): EhencedStore<S> {
  let _currentReducers = reducers;
  let handler = {
    get: function(target: Store<S>, name) {
      if (name === "addReducer") {
        return ({ reducerKey, reducer }) => {
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
      if (name === "removeReducer") {
        return reducerKey => {
          if (reducerKey == null) {
            throw new Error("Can not remove reducerKey of null.");
          }
          let newReducers = Object.assign({}, _currentReducers);
          let allStates = target.getState();
          delete newReducers[reducerKey];
          _currentReducers = newReducers;
          delete allStates[reducerKey];
          target.replaceReducer(combineReducers(newReducers));
          return true;
        };
      }
      if (name === "replaceReducer") {
        return ({ reducerKey, reducer }) => {
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
      return target[name];
    }
  };
  return <EhencedStore<S>>new Proxy(store, handler);
}

export default function createEnhancedStore(
  reducers: ReducersMapObject,
  initialState: any,
  enhencer: GenericStoreEnhancer
) {
  let store = createStore(combineReducers(reducers), initialState, enhencer);
  return storeEnhancer(store, reducers);
}
