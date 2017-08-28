import { ARENASWITCH_SET_STATE, SCENE_LOAD_END } from "../actionTypes";
import { ARENASWITCH_EVENT_LOADSCENE_CONTINUE } from "../../actionTypes";
import {
  take,
  put,
  fork,
  select,
  cancel,
  cancelled,
  getContext
} from "redux-saga/effects";
import { connect } from "react-redux";
import {
  bindArenaActionCreators,
  createProxyMapStateToProps
} from "../../enhencedRedux";
import { bindActionCreators } from "redux";
import { sceneApplyRedux } from "./sceneReduxSaga";

function calcNewReduxInfo(reduxInfo, newReduxInfo, dispatch, isPlainActions) {
  let connectedActions = reduxInfo.connectedActions;
  if (
    reduxInfo.reducerKey !== newReduxInfo.reducerKey ||
    reduxInfo.uniqueReducerKey !== newReduxInfo.reducerKey ||
    reduxInfo.vReducerKey !== newReduxInfo.vReducerKey ||
    reduxInfo.parentArenaReducerDict !== newReduxInfo.parentArenaReducerDict ||
    reduxInfo.actions !== newReduxInfo.actions
  ) {
    if (reduxInfo.actions !== newReduxInfo.actions) {
      if (newReduxInfo.actions == null) {
        connectedActions = {};
      } else if (isPlainActions === true) {
        connectedActions = bindActionCreators(
          newReduxInfo.actions,
          store.dispatch
        );
      } else {
        connectedActions = bindArenaActionCreators(
          newReduxInfo.actions,
          store.dispatch,
          newReducerKey
        );
      }
    }
    let item = {
      reducerKey: newReduxInfo.reducerKey,
      actions: connectedActionss
    };
    let newArenaReducerDict = Object.assign(
      newReduxInfo.parentArenaReducerDict,
      { _curScene: item }
    );
    if (reducerKey != null) newArenaReducerDict[reducerKey] = item;
    if (vReducerKey != null) newArenaReducerDict[vReducerKey] = item;
  }
  return Object.assign({}, newReduxInfo, {
    connectedActions,
    arenaReducerDict: newArenaReducerDict
  });
}

/**
 * Scene of the synchronous load function, it does the following.
 * 1. load, add, replace reducer.
 * 2. Set the state of the corresponding scene.
 * 3. Run the corresponding scene of the saga, cancel the last scene of the task.
 * 4. Connect redux according to the incoming mapStateToProps and actions.
 * 
 * @param {any} { arenaReducerDict, sceneBundle } 
 */
export function* applySceneBundle({ parentArenaReducerDict, sceneBundle }) {
  let arenaSwitchReducerKey = parentArenaReducerDict._curSwitch.reducerKey;
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene,
    isWaiting,
    sceneNo,
    arenaReducerDict
  } = yield select(state => state[arenaSwitchReducerKey]);
  let newSceneNo = sceneNo + 1;
  yield put({
    type: ARENASWITCH_SET_STATE,
    arenaSwitchReducerKey,
    state: { sceneNo: newSceneNo }
  });
  let options = sceneBundle.options || {};
  let { newReducerKey, newSagaTask } = yield* sceneApplyRedux({
    arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    curSceneBundle,
    reduxInfo
  });
  let store = yield getContext("store");
  let newReduxInfo = calcNewReduxInfo(
    reduxInfo,
    {
      reducerKey: newReducerKey,
      sagaTask: newSagaTask,
      uniqueReducerKey: options.reducerKey,
      vReducerKey: options.vReducerKey,
      parentArenaReducerDict,
      actions: sceneBundle.actions
    },
    store.dispatch,
    options.isPlainActions
  );
  let mapStateToProps = createProxyMapStateToProps(
    sceneBundle.mapStateToProps,
    newSceneNo,
    newReduxInfo.newArenaReducerDict
  );
  let PlayingScene = connect(mapStateToProps)(sceneBundle.Component);
  let displayName =
    sceneBundle.Component.displayName ||
    sceneBundle.Component.name ||
    "Unknown";
  PlayingScene.displayName = `SceneConnect({reducerKey:${newReducerKey},Component:${displayName}})`;
  let newArenaState = {
    PlayingScene,
    curSceneBundle: sceneBundle,
    reduxInfo: newReduxInfo
  };
  if (isWaiting) {
    yield take(ARENASWITCH_EVENT_LOADSCENE_CONTINUE);
  }
  yield put({
    type: ARENASWITCH_SET_STATE,
    arenaSwitchReducerKey,
    state: newArenaState
  });
}

/**
 * The asynchronous loading function of the scene, 
 * and finally the synchronous load function
 * 
 * @param {any} { arenaReducerDict, asyncSceneBundle } 
 * @returns 
 */
export function* applyAsyncSceneBundle({ arenaReducerDict, asyncSceneBundle }) {
  let sceneBundle;
  try {
    sceneBundle = yield asyncSceneBundle;
  } finally {
    if (yield cancelled()) {
    }
  }
  yield put({
    type: SCENE_LOAD_END,
    arenaReducerDict,
    asyncSceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield* applySceneBundle({
    arenaReducerDict,
    sceneBundle
  });
  return true;
}
