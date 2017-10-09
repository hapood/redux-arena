import { applyMiddleware, compose } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA } from "./actionTypes";
import createSagaMiddleware, { END } from "redux-saga";
import { getArenaInitState, arenaReducer } from "./reducers";
import { createEnhancedStore } from "./enhancedRedux";
import rootSaga from "./sagas";

/**
 * This is an initialization function,
 * you can pass some of the initialization of some
 * initialization reducer, state, saga or some other redux middleware,
 * such as redux-thunk
 * If you pass in a custom saga, it will use fork to run once and
 * keep the running task information in the root of the arena
 * @export
 * @param {any} [reducers={}]  
 * @param {any} [initialStates={}] 
 * @param {any} saga 
 * @param {any} enhencers 
 * @returns
 */
export function createArenaStore(
  reducers = {},
  initialStates = {},
  enhencers,
  sagaOptions
) {
  const sagaMiddleware = createSagaMiddleware(sagaOptions);
  const store = createEnhancedStore(
    Object.assign(
      {
        arena: arenaReducer
      },
      reducers
    ),
    Object.assign(
      {
        arena: getArenaInitState()
      },
      initialStates
    ),
    enhencers
      ? compose(applyMiddleware(sagaMiddleware), ...enhencers)
      : applyMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(rootSaga, { store });
  store.close = () => store.dispatch(END);
  store.runSaga = saga =>
    store.dispatch({
      type: ARENA_INIT_AUDIENCE_SAGA,
      saga
    });
  return store;
}
