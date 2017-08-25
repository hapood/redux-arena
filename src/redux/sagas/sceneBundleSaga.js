import { ARENASWITCH_SET_STATE, SCENE_LOAD_END } from "../actionTypes";
import { ARENASWITCH_EVENT_LOADSCENE_CONTINUE } from "../../actionTypes";
import { take, put, fork, select, cancel, cancelled } from "redux-saga/effects";
import { connect } from "react-redux";
import {
  bindArenaActionCreators,
  createProxyMapStateToProps
} from "../../enhencedRedux";
import { bindActionCreators } from "redux";
import { sceneApplyRedux } from "./sceneReduxSaga";

/**
 * Scene of the synchronous load function, it does the following.
 * 1. load, add, replace reducer.
 * 2. Set the state of the corresponding scene.
 * 3. Run the corresponding scene of the saga, cancel the last scene of the task.
 * 4. Connect redux according to the incoming mapStateToProps and actions.
 * 
 * @param {any} { arenaSwitchReducerKey, sceneBundle } 
 */
export function* applySceneBundle({ arenaSwitchReducerKey, sceneBundle }) {
  let mapDispatchToProps;
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene,
    isWaiting,
    sceneNo
  } = yield select(state => state[arenaSwitchReducerKey]);
  let newSceneNo = sceneNo + 1;
  yield put({
    type: ARENASWITCH_SET_STATE,
    arenaSwitchReducerKey,
    state: { sceneNo: newSceneNo }
  });
  let options = sceneBundle.options || {};
  let reducerKey = yield* sceneApplyRedux({
    arenaSwitchReducerKey,
    reducerKey: options.reducerKey,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    curSceneBundle,
    reduxInfo
  });
  if (sceneBundle.actions) {
    mapDispatchToProps = dispatch =>
      options.isPlainActions === true
        ? bindActionCreators(sceneBundle.actions, dispatch)
        : bindArenaActionCreators(sceneBundle.actions, dispatch, reducerKey);
  }
  let mapStateToProps;
  if (sceneBundle.mapStateToProps) {
    mapStateToProps = createProxyMapStateToProps(
      sceneBundle.mapStateToProps,
      reducerKey,
      arenaSwitchReducerKey,
      newSceneNo
    );
  }
  let PlayingScene = connect(mapStateToProps, mapDispatchToProps)(
    sceneBundle.Component
  );
  let displayName =
    sceneBundle.Component.displayName ||
    sceneBundle.Component.name ||
    "Unknown";
  PlayingScene.displayName = `SceneConnect({reducerKey:${reducerKey},Component:${displayName}})`;
  let newArenaState = {
    PlayingScene,
    curSceneBundle: sceneBundle
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
 * @param {any} { arenaSwitchReducerKey, asyncSceneBundle } 
 * @returns 
 */
export function* applyAsyncSceneBundle({
  arenaSwitchReducerKey,
  asyncSceneBundle
}) {
  let sceneBundle;
  try {
    sceneBundle = yield asyncSceneBundle;
  } finally {
    if (yield cancelled()) {
    }
  }
  yield put({
    type: SCENE_LOAD_END,
    arenaSwitchReducerKey,
    asyncSceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield* applySceneBundle({
    arenaSwitchReducerKey,
    sceneBundle
  });
  return true;
}
