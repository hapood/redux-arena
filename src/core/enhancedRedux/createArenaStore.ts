import { applyMiddleware, compose } from "redux";
import { actionTypes } from "../actionTypes";
import { ReducersMapObject, GenericStoreEnhancer, Middleware } from "redux";
import createSagaMiddleware, { END, SagaMiddlewareOptions } from "redux-saga";
import { getArenaInitState, arenaReducer } from "../reducers";
import createEnhancedStore, { EhancedStore } from "./createEnhancedStore";
import rootSaga from "../sagas";

export type ArenaStoreOptions = {
  sagaOptions?: SagaMiddlewareOptions<{}>;
  initialStates?: any;
  enhencers?: GenericStoreEnhancer[];
  middlewares?: Middleware[];
};

export default function createArenaStore(
  reducers: ReducersMapObject = {},
  options: ArenaStoreOptions = {}
) {
  let { enhencers, sagaOptions, initialStates, middlewares } = options;
  let sagaMiddleware = createSagaMiddleware(sagaOptions);
  let mergedMiddlewares: Middleware[] = [sagaMiddleware];
  if (middlewares) {
    mergedMiddlewares = mergedMiddlewares.concat(middlewares);
  }
  let store = createEnhancedStore(
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
      initialStates || {}
    ),
    enhencers
      ? compose(applyMiddleware(...mergedMiddlewares), ...enhencers)
      : applyMiddleware(...mergedMiddlewares)
  );
  sagaMiddleware.run(rootSaga, { store });
  store.close = () => store.dispatch(END);
  store.runSaga = saga =>
    store.dispatch({
      type: actionTypes.ARENA_INIT_AUDIENCE_SAGA,
      saga
    });
  return store;
}
