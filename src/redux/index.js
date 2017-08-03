import { createStore, applyMiddleware, combineReducers } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA } from "./actionTypes";
import createSagaMiddleware, { END } from "redux-saga";
import {
  getSceneInitState,
  getArenaInitState,
  arenaReducer,
  createSenceReducer
} from "./reducers";
import rootSaga from "./sagas";

const rootReducer = {
  arena: arenaReducer,
  scene: createSenceReducer()
};

const rootState = {
  arena: getArenaInitState(),
  scene: getSceneInitState()
};

function createProxyStore(store, audienceReducer) {
  const handler = {
    get: function(target, name) {
      return name === "replaceReducer"
        ? reducer => {
            let newReducer = Object.assign(
              {},
              rootReducer,
              audienceReducer,
              reducer
            );
            let state = target.getState();
            for (let key in state) {
              if (newReducer[key] == null) delete state[key];
            }
            return target.replaceReducer(combineReducers(newReducer));
          }
        : target[name];
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
  const store = createProxyStore(
    createStore(
      combineReducers(Object.assign({}, rootReducer, reducer)),
      Object.assign({}, rootState, initialState),
      applyMiddleware(...[sagaMiddleware].concat(milldewares))
    ),
    reducer
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
