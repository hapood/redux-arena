import { createStore, applyMiddleware, combineReducers } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA, ARENA_SET_STATE } from "./actionTypes";
import createSagaMiddleware, { END } from "redux-saga";
import { getSceneInitState, getArenaInitState, arenaReducer } from "./reducers";
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
        return ({ reducerKey, reducer }) => {
          let state = target.getState();
          if (state[reducerKey] != null) return false;
          currentReducers = Object.assign({}, currentReducers, {
            [reducerKey]: reducer
          });
          target.replaceReducer(combineReducers(currentReducers));
          return true;
        };
      }
      if (name === "removeReducer") {
        return reducerNameList => {
          let state = target.getState();
          let newReducers = Object.assign({}, currentReducers);
          reducerKeyList.forEach(reducerKey => {
            delete state[reducerKey];
            delete newReducers[reducerKey];
          });
          currentReducers = newReducers;
          return target.replaceReducer(combineReducers(newReducer));
        };
      }
      if (name === "setHistory") {
        return history =>
          store.dispatch({
            type: ARENA_SET_STATE,
            state: {
              history
            }
          });
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
