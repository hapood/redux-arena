import { ARENA_SCENE_REPLACE_STATE } from "../actionTypes";
import { ARENA_SCENE_SET_STATE } from "../../actionTypes";
import { put, fork, select, getContext, setContext } from "redux-saga/effects";
import { bindActionCreators } from "redux";
import { bindArenaActionCreators } from "../enhancedRedux";
import { createSceneReducer, sceneReducerWrapper } from "../reducers";
import {
  sceneAddStateTreeNode,
  sceneReplaceStateTreeNode,
  sceneAddReducer,
  sceneReplaceReducer,
  sceneRmAndAddReducer
} from "../../utils";
import { getSwitchInitState } from "../reducers";

const defaultActions = {
  setState: state => ({ type: ARENA_SCENE_SET_STATE, state })
};

function calcNewReduxInfo(reduxInfo, newReduxInfo, dispatch, isSceneActions) {
  let connectedActions = reduxInfo.connectedActions;
  let newArenaReducerDict = reduxInfo.arenaReducerDict;
  if (
    reduxInfo.reducerKey !== newReduxInfo.reducerKey ||
    reduxInfo.vReducerKey !== newReduxInfo.vReducerKey ||
    reduxInfo.parentArenaReducerDict !== newReduxInfo.parentArenaReducerDict ||
    reduxInfo.actions !== newReduxInfo.actions
  ) {
    //calc actions
    if (
      reduxInfo.actions !== newReduxInfo.actions ||
      connectedActions == null
    ) {
      if (isSceneActions === false) {
        connectedActions = bindActionCreators(
          newReduxInfo.actions || defaultActions,
          dispatch
        );
      } else {
        connectedActions = bindArenaActionCreators(
          newReduxInfo.actions || defaultActions,
          dispatch,
          newReduxInfo.reducerKey
        );
      }
    }
    //calc arena reducer dict
    let item = {
      reducerKey: newReduxInfo.reducerKey,
      vReducerKey: newReduxInfo.vReducerKey,
      actions: connectedActions
    };
    newArenaReducerDict = Object.assign(newReduxInfo.parentArenaReducerDict, {
      [newReduxInfo.reducerKey]: item,
      _arenaScene: item
    });
    if (newReduxInfo.vReducerKey != null)
      newArenaReducerDict[newReduxInfo.vReducerKey] = item;
  }
  return Object.assign({}, newReduxInfo, {
    connectedActions,
    arenaReducerDict: newArenaReducerDict
  });
}

function* forkSagaWithContext(saga, ctx) {
  yield setContext(ctx);
  yield fork(saga);
}

function buildReducerFactory(options, reducer, state, arenaReducerDict) {
  return options.isSceneReducer === false
    ? bindingReducerKey =>
        createSceneReducer(reducer, bindingReducerKey, state, arenaReducerDict)
    : bindingReducerKey =>
        createSceneReducer(
          reducer && sceneReducerWrapper(reducer),
          bindingReducerKey,
          state,
          arenaReducerDict
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
  parentArenaReducerDict,
  state,
  saga,
  actions,
  reducer,
  options
}) {
  let arenaStore = yield getContext("store");
  let reducerFactory = buildReducerFactory(
    options,
    reducer,
    state,
    parentArenaReducerDict
  );
  let newReducerKey = sceneAddReducer(
    arenaStore,
    options.reducerKey,
    reducerFactory,
    state
  );
  sceneAddStateTreeNode(
    arenaStore,
    getParentReducerKey(parentArenaReducerDict),
    newReducerKey
  );
  let newReduxInfo = calcNewReduxInfo(
    {},
    {
      reducerKey: newReducerKey,
      vReducerKey: options.vReducerKey,
      parentArenaReducerDict,
      actions
    },
    arenaStore.dispatch,
    options.isSceneActions,
    saga
  );
  if (saga) {
    newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
      arenaReducerDict: newReduxInfo.arenaReducerDict
    });
  }
  return newReduxInfo;
}

export function* sceneUpdateRedux({
  parentArenaReducerDict,
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
    options,
    reducer,
    state,
    parentArenaReducerDict
  );
  if (
    options.reducerKey == null ||
    options.reducerKey === reduxInfo.reducerKey
  ) {
    if (reducer !== curSceneBundle.reducer) {
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
  } else if (options.reducerKey !== reduxInfo.reducerKey) {
    let oldState = yield select(state => state[reduxInfo.reducerKey]);
    newReducerKey = sceneRmAndAddReducer(
      arenaStore,
      reduxInfo.reducerKey,
      options.reducerKey,
      reducerFactory,
      state === curSceneBundle.state ? oldState : state
    );
    sceneReplaceStateTreeNode(arenaStore, reduxInfo.reducerKey, newReducerKey);
  } else if (state !== curSceneBundle.state) {
    yield put({
      type: ARENA_SCENE_REPLACE_STATE,
      _sceneReducerKey: newReducerKey,
      state
    });
  }
  let newReduxInfo = calcNewReduxInfo(
    reduxInfo,
    {
      reducerKey: newReducerKey,
      vReducerKey: options.vReducerKey,
      parentArenaReducerDict,
      actions
    },
    arenaStore.dispatch,
    options.isSceneActions
  );
  if (saga) {
    newReduxInfo.saga = yield fork(forkSagaWithContext, saga, {
      arenaReducerDict: newReduxInfo.arenaReducerDict
    });
  }
  return newReduxInfo;
}
