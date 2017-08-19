import { applyMiddleware, compose } from "redux";
import { ARENA_INIT_AUDIENCE_SAGA } from "./actionTypes";
import createSagaMiddleware, { END } from "redux-saga";
import { getArenaInitState, arenaReducer } from "./reducers";
import createEnhancedStore from "./createEnhancedStore";
import rootSaga from "./sagas";

export function createArenaStore(
  reducers = {},
  initialStates = {},
  saga,
  enhencers
) {
  const sagaMiddleware = createSagaMiddleware();
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
