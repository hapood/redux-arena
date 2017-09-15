import {
  ARENA_SCENE_CLEAR_REDUX,
  ARENA_SCENE_REPLACE_STATE
} from "../actionTypes";
import { ARENA_SCENE_SET_STATE } from "../../actionTypes";
import {
  takeEvery,
  take,
  put,
  call,
  fork,
  spawn,
  select,
  cancel,
  cancelled,
  getContext,
  setContext
} from "redux-saga/effects";
import { bindActionCreators } from "redux";
import { bindArenaActionCreators } from "../enhancedRedux";
import { createSenceReducer, sceneReducerWrapper } from "../reducers";
import {
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
      _curScene: item
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

export function* sceneApplyRedux({
  parentArenaReducerDict,
  state,
  saga,
  actions,
  reducer,
  options
}) {
  let arenaStore = yield getContext("store");
  let reducerFactory =
    options.isSceneReducer === false
      ? bindingReducerKey =>
          createSenceReducer(
            reducer,
            bindingReducerKey,
            state,
            parentArenaReducerDict
          )
      : bindingReducerKey =>
          createSenceReducer(
            reducer && sceneReducerWrapper(reducer),
            bindingReducerKey,
            state,
            parentArenaReducerDict
          );
  let newReducerKey = sceneAddReducer(
    arenaStore,
    options.reducerKey,
    reducerFactory,
    state
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
    options.isSceneActions
  );
  if (saga) {
    newReduxInfo.sagaTask = yield spawn(forkSagaWithContext, saga, {
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
  try {
    if (saga !== curSceneBundle.saga) {
      if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
    }
  } finally {
    if (yield cancelled()) {
    }
  }
  let reducerFactory =
    options.isSceneReducer === false
      ? bindingReducerKey =>
          createSenceReducer(
            reducer,
            bindingReducerKey,
            state,
            parentArenaReducerDict
          )
      : bindingReducerKey =>
          createSenceReducer(
            reducer && sceneReducerWrapper(reducer),
            bindingReducerKey,
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
    }
  } else if (options.reducerKey !== reduxInfo.reducerKey) {
    newReducerKey = sceneRmAndAddReducer(
      arenaStore,
      reduxInfo.reducerKey,
      options.reducerKey,
      reducerFactory,
      state === curSceneBundle.state ? null : state
    );
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
    if (
      saga !== curSceneBundle.saga ||
      newReducerKey !== reduxInfo.reducerKey ||
      reduxInfo.sagaTask.isCancelled()
    ) {
      newReduxInfo.sagaTask = yield spawn(forkSagaWithContext, saga, {
        arenaReducerDict: newReduxInfo.arenaReducerDict
      });
    }
  }
  return newReduxInfo;
}

function* sceneClearRedux({ arenaSwitchReducerKey, reduxInfo }) {
  let arenaStore = yield getContext("store");
  console.log(reduxInfo)
  if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
  if (reduxInfo.reducerKey) {
    arenaStore.removeReducer(reduxInfo.reducerKey);
  }
}

export default function* saga() {
  yield takeEvery(ARENA_SCENE_CLEAR_REDUX, sceneClearRedux);
}
