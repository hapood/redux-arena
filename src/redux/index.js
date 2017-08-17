import { createStore, applyMiddleware, combineReducers } from "redux";
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
      return target[name];
    }
  };
  return new Proxy(store, handler);
}

export function createArenaStore(
  reducer = {},
  initialState = {},
  saga,
  milldewares = []
) {
  const sagaMiddleware = createSagaMiddleware();
  currentReducers = Object.assign({}, currentReducers, reducer);
  const store = createProxyStore(
    createStore(
      combineReducers(currentReducers),
      Object.assign({}, rootState, initialState),
      applyMiddleware(...[sagaMiddleware].concat(milldewares))
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
