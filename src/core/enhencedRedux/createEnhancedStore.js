/**
 * Create redux-arena proxy store
 */
import { createStore, combineReducers } from "redux";

function storeEnhancer(store, reducers) {
  let _currentReducers = reducers;
  const handler = {
    get: function(target, name) {
      if (name === "addReducer") {
        return ({ reducerKey, reducer }) => {
          let allStates = target.getState();
          if (allStates[reducerKey] != null) return false;
          _currentReducers = Object.assign({}, _currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(_currentReducers));
          return true;
        };
      }
      if (name === "removeReducer") {
        return reducerKey => {
          if (reducerKey == null) return false;
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
      if (name === "removeAndAddReducer") {
        return ({ reducerKeyRemoved, reducerKeyAdded, reducer }) => {
          if (reducerKeyRemoved == null || reducerKeyAdded == null)
            throw new Error(
              `reducerKeyRemoved or reducerKeyAdded can not be null.`
            );
          if (_currentReducers[reducerKeyRemoved] == null)
            throw new Error(
              `reducer of key [${reducerKeyRemoved}] doesn't exsit.`
            );
          let newReducers = Object.assign({}, _currentReducers);
          let allStates = target.getState();
          delete allStates[reducerKeyRemoved];
          delete newReducers[reducerKeyRemoved];
          if (newReducers[reducerKeyAdded] != null)
            throw new Error(
              `reducer of key [${reducerKeyAdded}] already exsit.`
            );
          newReducers[reducerKeyAdded] = reducer;
          _currentReducers = newReducers;
          target.replaceReducer(combineReducers(newReducers));
          return reducerKeyAdded;
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
