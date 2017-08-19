/**
 * Create redux-arena proxy store
 */
import { createStore, combineReducers } from "redux";

function storeEnhancer(store, reducers) {
  let _currentReducers = reducers;
  const handler = {
    get: function(target, name) {
      if (name === "addReducer") {
        return ({ reducerKey, reducer, state }) => {
          let allStates = target.getState();
          if (allStates[reducerKey] != null) return false;
          _currentReducers = Object.assign({}, _currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(_currentReducers));
          allStates = target.getState();
          allStates[reducerKey] = state;
          return true;
        };
      }
      if (name === "removeReducer") {
        return reducerKey => {
          if (reducerKey == null) return;
          let newReducers = Object.assign({}, _currentReducers);
          let allStates = target.getState();
          delete newReducers[reducerKey];
          _currentReducers = newReducers;
          target.replaceReducer(combineReducers(newReducers));
          delete allStates[reducerKey];
        };
      }
      if (name === "replaceReducer") {
        return ({ reducerKey, reducer, state }) => {
          if (reducerKey == null)
            throw new Error(`reducerKey can not be null.`);
          let allStates = target.getState();
          if (_currentReducers[reducerKey] == null)
            throw new Error(`reducer for key [${reducerKey}] doesn't exsit.`);
          _currentReducers = Object.assign({}, _currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(newReducers));
          allStates = target.getState();
          if (state) allStates[reducerKey] = state;
        };
      }
      if (name === "removeAndSetReducer") {
        return ({ reducerKeyRemove, reducerKeySet, reducer, state }) => {
          if (reducerKeyRemove == null || reducerKeySet == null)
            throw new Error(
              `reducerKeyRemove or reducerKeySet can not be null.`
            );
          if (_currentReducers[reducerKeyRemove] == null)
            throw new Error(
              `reducer of key [${reducerKeyRemove}] doesn't exsit.`
            );
          let newReducers = Object.assign({}, _currentReducers);
          let allStates = target.getState();
          let oldState = allStates[reducerKeyRemove];
          delete allStates[reducerKeyRemove];
          delete newReducers[reducerKeyRemove];
          if (newReducers[reducerKeySet] == null)
            throw new Error(`reducer of key [${reducerKeySet}] already exsit.`);
          newReducers[reducerKeySet] = reducer;
          target.replaceReducer(combineReducers(newReducers));
          allStates = target.getState();
          allStates[reducerKeySet] = state ? state : oldState;
        };
      }
      return target[name];
    }
  };
  return new Proxy(store, handler);
}

export default function createEnhancedStore(reducers, initialState, enhencer) {
  let store = createStore(combineReducers(reducers), initialState, enhencer);
  return storeEnhancer(store, reducers);
}
