import { createStore, applyMiddleware, combineReducers } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA, ARENA_SET_STATE } from "./actionTypes";
import createSagaMiddleware, { END } from "redux-saga";
import {
  getSceneInitState,
  getArenaInitState,
  arenaReducer,
  createSenceReducer
} from "./reducers";
import rootSaga from "./sagas";

let currentReducers = {
  arena: arenaReducer,
  scene: createSenceReducer()
};

const rootState = {
  arena: getArenaInitState(),
  scene: getSceneInitState()
};

function createProxyStore(store) {
  const handler = {
    get: function(target, name) {
      if (name === "replaceReducers") {
        return reducer => {
          currentReducers = Object.assign({}, currentReducers, reducer);
          return target.replaceReducer(combineReducers(currentReducers));
        };
      }
      if (name === "removeReducers") {
        return reducerNameList => {
          let state = target.getState();
          let newReducers = Object.assign({}, currentReducers);
          reducerKeyList.forEach(reducerKey => {
            delete state[key];
            delete newReducers[key];
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
  store.runSaga(rootSaga);
  if (saga)
    store.dispatch({
      type: ARENA_INIT_AUDIENCE_SAGA,
      saga
    });
  return store;
}
