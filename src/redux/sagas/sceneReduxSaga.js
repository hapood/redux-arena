import {
  ARENA_SCENE_CLEAR_REDUX,
  ARENA_SCENE_REPLACE_STATE,
  ARENA_SWITCH_SET_STATE
} from "../actionTypes";
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
import { bindArenaActionCreators } from "../../enhencedRedux";
import createSenceReducer from "../reducers/createSenceReducer";
import { sceneAddReducer, sceneReplaceReducer } from "../../utils";
import { getArenaSwitchInitState } from "../reducers";

function calcNewReduxInfo(reduxInfo, newReduxInfo, dispatch, isPlainActions) {
  let connectedActions = reduxInfo.connectedActions;
  let newArenaReducerDict = reduxInfo.arenaReducerDict;
  if (
    reduxInfo.reducerKey !== newReduxInfo.reducerKey ||
    reduxInfo.uniqueReducerKey !== newReduxInfo.reducerKey ||
    reduxInfo.vReducerKey !== newReduxInfo.vReducerKey ||
    reduxInfo.parentArenaReducerDict !== newReduxInfo.parentArenaReducerDict ||
    reduxInfo.actions !== newReduxInfo.actions
  ) {
    //calc actions
    if (reduxInfo.actions !== newReduxInfo.actions) {
      if (newReduxInfo.actions == null) {
        connectedActions = {};
      } else if (isPlainActions === true) {
        connectedActions = bindActionCreators(newReduxInfo.actions, dispatch);
      } else {
        connectedActions = bindArenaActionCreators(
          newReduxInfo.actions,
          dispatch,
          newReduxInfo.reducerKey
        );
      }
    }
    //calc arena reducer dict
    let item = {
      reducerKey: newReduxInfo.reducerKey,
      actions: connectedActions
    };
    newArenaReducerDict = Object.assign(newReduxInfo.parentArenaReducerDict, {
      _curScene: item
    });
    if (newReduxInfo.uniqueReducerKey != null)
      newArenaReducerDict[newReduxInfo.uniqueReducerKey] = item;
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
  if (reduxInfo.reducerKey == null) {
    newReducerKey = sceneAddReducer(
      arenaStore,
      options.reducerKey,
      newReducerKey => createSenceReducer(reducer, newReducerKey),
      state
    );
  } else if (
    options.reducerKey == null ||
    options.reducerKey === reduxInfo.reducerKey
  ) {
    if (reducer !== curSceneBundle.reducer) {
      newReducerKey = sceneReplaceReducer(
        arenaStore,
        reduxInfo.reducerKey,
        newReducerKey => createSenceReducer(reducer, newReducerKey),
        state === curSceneBundle.state ? null : state
      );
    } else if (state !== curSceneBundle.state) {
      newReducerKey = reduxInfo.reducerKey;
      yield put({
        type: ARENA_SCENE_REPLACE_STATE,
        _sceneReducerKey: reduxInfo.reducerKey,
        state
      });
    }
  } else if (options.reducerKey !== reduxInfo.reducerKey) {
    newReducerKey = add(
      arenaStore,
      options.reducerKey,
      newReducerKey => createSenceReducer(reducer, newReducerKey),
      state === curSceneBundle.state ? null : state
    );
  }

  let newReduxInfo = calcNewReduxInfo(
    reduxInfo,
    {
      reducerKey: newReducerKey,
      uniqueReducerKey: options.reducerKey,
      vReducerKey: options.vReducerKey,
      parentArenaReducerDict,
      actions
    },
    arenaStore.dispatch,
    options.isPlainActions
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
  if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
  if (reduxInfo.reducerKey) {
    yield put({
      type: ARENA_SWITCH_SET_STATE,
      arenaSwitchReducerKey: arenaSwitchReducerKey,
      state: getArenaSwitchInitState()
    });
    arenaStore.removeReducer(reduxInfo.reducerKey);
  }
}

export default function* saga() {
  yield takeEvery(ARENA_SCENE_CLEAR_REDUX, sceneClearRedux);
}
