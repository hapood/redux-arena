import { ARENA_SCENE_REPLACE_STATE } from "../actionTypes";
import { ARENA_SCENE_SET_STATE } from "../../actionTypes";
import { put, fork, select, getContext, setContext } from "redux-saga/effects";
import { bindActionCreators } from "redux";
import { bindArenaActionCreators } from "../enhancedRedux";
import { createSceneReducer, sceneReducerWrapper } from "../reducers";
import {
  addStateTreeNode,
  sceneAddReducer,
  sceneReplaceReducer,
  buildSceneReducerDict
} from "../../utils";

const defaultActions = {
  setState: state => ({ type: ARENA_SCENE_SET_STATE, state })
};

function bindActions(actions, reducerKey, dispatch, isSceneActions) {
  if (isSceneActions === false) {
    return bindActionCreators(actions || defaultActions, dispatch);
  } else {
    return bindArenaActionCreators(
      actions || defaultActions,
      dispatch,
      reducerKey
    );
  }
}

function* forkSagaWithContext(saga, ctx) {
  yield setContext(ctx);
  yield fork(saga);
}

function buildReducerFactory(reducer, state, isSceneReducer) {
  return isSceneReducer === false
    ? bindingReducerKey => createSceneReducer(reducer, state, bindingReducerKey)
    : bindingReducerKey =>
        createSceneReducer(
          reducer && sceneReducerWrapper(reducer),
          state,
          bindingReducerKey
        );
}

function getParentReducerKey(arenaReducerDict) {
  return (
    arenaReducerDict &&
    arenaReducerDict._arenaCurtain &&
    arenaReducerDict._arenaCurtain.reducerKey
  );
}

export function* sceneApplyRedux({
  arenaReducerDict,
  state,
  saga,
  actions,
  reducer,
  options
}) {
  let arenaStore = yield getContext("store");
  let reducerFactory = buildReducerFactory(
    reducer,
    state,
    options.isSceneReducer
  );
  let newReducerKey = sceneAddReducer(
    arenaStore,
    options.reducerKey,
    reducerFactory,
    state
  );
  let bindedActions = bindActions(
    actions,
    newReducerKey,
    arenaStore.dispatch,
    options.isSceneActions
  );
  let newArenaReducerDict = buildSceneReducerDict(
    arenaReducerDict,
    newReducerKey,
    options.vReducerKey,
    bindedActions
  );
  let newReduxInfo = {
    reducerKey: newReducerKey,
    origArenaReducerDict: arenaReducerDict,
    actions,
    options,
    saga,
    bindedActions,
    arenaReducerDict: newArenaReducerDict
  };
  addStateTreeNode(
    arenaStore,
    getParentReducerKey(newReduxInfo.arenaReducerDict),
    newReducerKey
  );
  if (saga) {
    newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
      arenaReducerDict: newReduxInfo.arenaReducerDict
    });
  }
  return newReduxInfo;
}

export function* sceneUpdateRedux({
  arenaReducerDict,
  state,
  saga,
  actions,
  reducer,
  options,
  curSceneBundle,
  reduxInfo
}) {
  let newReducerKey = reduxInfo.reducerKey;
  let arenaStore = yield getContext("store");
  let reducerFactory = buildReducerFactory(
    reducer,
    state,
    options.isSceneReducer
  );
  let newReduxInfo = Object.assign({}, reduxInfo, { options });
  if (
    options.reducerKey != null &&
    options.reducerKey !== reduxInfo.reducerKey
  ) {
    let oldState = yield select(state => state[reduxInfo.reducerKey]);
    newReducerKey = sceneAddReducer(
      arenaStore,
      options.reducerKey,
      reducerFactory,
      state === curSceneBundle.state ? oldState : state
    );
    addStateTreeNode(arenaStore, newReducerKey);
  } else if (options.reducerKey === reduxInfo.reducerKey) {
    if (
      reducer !== curSceneBundle.reducer ||
      options.isSceneReducer !== reduxInfo.options.isSceneReducer
    ) {
      newReducerKey = sceneReplaceReducer(
        arenaStore,
        reduxInfo.reducerKey,
        reducerFactory,
        state === curSceneBundle.state ? null : state
      );
    } else if (state !== curSceneBundle.state) {
      arenaStore.dispatch({
        type: ARENA_SCENE_REPLACE_STATE,
        _sceneReducerKey: newReducerKey,
        state
      });
    }
  } else if (state !== curSceneBundle.state) {
    yield put({
      type: ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  }
  newReduxInfo.reducerKey = newReducerKey;
  if (
    actions !== reduxInfo.actions ||
    options.isSceneActions !== reduxInfo.options.isSceneActions
  ) {
    newReduxInfo.actions = actions;
    newReduxInfo.bindedActions = bindActions(
      actions,
      newReducerKey,
      arenaStore.dispatch,
      options.isSceneActions
    );
  }
  if (
    newReducerKey !== reduxInfo.reducerKey ||
    options.vReducerKey !== reduxInfo.options.vReducerKey ||
    arenaReducerDict !== reduxInfo.origArenaReducerDict
  ) {
    newReduxInfo.arenaReducerDict = buildSceneReducerDict(
      arenaReducerDict,
      newReducerKey,
      options.vReducerKey,
      newReduxInfo.actions
    );
  }
  if (saga) {
    newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
      arenaReducerDict: newReduxInfo.arenaReducerDict
    });
  }
  return newReduxInfo;
}
