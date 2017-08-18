import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA } from "./actionTypes";
import createSagaMiddleware, { END } from "redux-saga";
import { getArenaInitState, arenaReducer } from "./reducers";
import rootSaga from "./sagas";

let currentReducers = {
  arena: arenaReducer
};

const rootState = {
  arena: getArenaInitState()
};

function createProxyStore(store) {
  const handler = {
    get: function(target, name) {
      if (name === "addReducer") {
        return ({ reducerKey, reducer, state }) => {
          let allStates = target.getState();
          if (allStates[reducerKey] != null) return false;
          allStates[reducerKey] = state;
          currentReducers = Object.assign({}, currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(currentReducers));
          return true;
        };
      }
      if (name === "removeReducer") {
        return reducerKey => {
          if (reducerKey == null) return;
          let newReducers = Object.assign({}, currentReducers);
          let allStates = target.getState();
          delete allStates[reducerKey];
          delete newReducers[reducerKey];
          currentReducers = newReducers;
          target.replaceReducer(combineReducers(newReducers));
        };
      }
      if (name === "replaceReducer") {
        return ({ reducerKey, reducer, state }) => {
          if (reducerKey == null)
            throw new Error(`reducerKey can not be null.`);
          let allStates = target.getState();
          if (currentReducers[reducerKey] == null)
            throw new Error(`reducer for key [${reducerKey}] doesn't exsit.`);
          if (state) allStates[reducerKey] = state;
          currentReducers = Object.assign({}, currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(newReducers));
        };
      }
      if (name === "removeAndSetReducer") {
        return ({ reducerKeyRemove, reducerKeySet, reducer, state }) => {
          if (reducerKeyRemove == null || reducerKeySet == null)
            throw new Error(
              `reducerKeyRemove or reducerKeySet can not be null.`
            );
          if (currentReducers[reducerKeyRemove] == null)
            throw new Error(
              `reducer of key [${reducerKeyRemove}] doesn't exsit.`
            );
          let newReducers = Object.assign({}, currentReducers);
          let allStates = target.getState();
          let oldState = allStates[reducerKeyRemove];
          delete allStates[reducerKeyRemove];
          delete newReducers[reducerKeyRemove];
          if (newReducers[reducerKeySet] == null)
            throw new Error(`reducer of key [${reducerKeySet}] already exsit.`);
          newReducers[reducerKeySet] = reducer;
          allStates[reducerKeySet] = state ? state : oldState;
          target.replaceReducer(combineReducers(newReducers));
        };
      }
      return target[name];
    }
  };
  return new Proxy(store, handler);
}

export function createArenaStore(
  reducer = {},
  initialState = {},
  saga,
  enhencers
) {
  const sagaMiddleware = createSagaMiddleware();
  currentReducers = Object.assign({}, currentReducers, reducer);
  const store = createProxyStore(
    createStore(
      combineReducers(currentReducers),
      Object.assign({}, rootState, initialState),
      enhencers
        ? compose(applyMiddleware(sagaMiddleware), ...enhencers)
        : applyMiddleware(sagaMiddleware)
    )
  );
  window.arenaStore = store;
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  store.runSaga(rootSaga, { store });
  if (saga)
    store.dispatch({
      type: ARENA_INIT_AUDIENCE_SAGA,
      saga
    });
  return store;
}
