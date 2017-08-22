import {
  SCENESWITCH_SWITCH_SCENE,
  SCENESWITCH_SET_STATE,
  SCENE_LOAD_END,
  SCENESWITCH_LOAD_ASYNCSCENE,
  SCENESWITCH_INIT_SAGA,
  SCENESWITCH_KILL_SAGA
} from "../actionTypes";
import {
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancel,
  cancelled,
  setContext,
  getContext
} from "redux-saga/effects";
import { connect } from "react-redux";
import { bindActionCreatorsWithSceneKey } from "../../enhencedRedux";
import { bindActionCreators } from "redux";
import { sceneApplyRedux } from "./sceneSaga";

function* sceneSwitchSwitchScene({ sceneSwitchKey, sceneBundle }) {
  let mapDispatchToProps;
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene
  } = yield select(state => state[sceneSwitchKey]);
  let reducerKey = yield* sceneApplyRedux({
    sceneSwitchKey,
    reducerKey: sceneBundle.reducerKey,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    curSceneBundle,
    reduxInfo
  });
  if (sceneBundle.actions) {
    mapDispatchToProps = dispatch =>
      sceneBundle.isPlainActions === true
        ? bindActionCreators(sceneBundle.actions, dispatch)
        : bindActionCreatorsWithSceneKey(
            sceneBundle.actions,
            dispatch,
            reducerKey
          );
  }
  let mapStateToProps;
  if (sceneBundle.mapStateToProps) {
    mapStateToProps = state => sceneBundle.mapStateToProps(state, reducerKey);
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
  yield put({
    type: SCENESWITCH_SET_STATE,
    sceneSwitchKey,
    state: newArenaState
  });
}

function* sceneSwitchLoadAsyncScene({ sceneSwitchKey, asyncSceneBundle }) {
  let sceneBundle;
  try {
    sceneBundle = yield asyncSceneBundle;
  } finally {
    if (yield cancelled()) {
    }
  }
  yield put({
    type: SCENE_LOAD_END,
    sceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield* sceneSwitchSwitchScene({
    sceneSwitchKey,
    sceneBundle
  });
  return true;
}

function* forkSagaWithContext(ctx) {
  yield setContext(ctx);
  yield fork(function*() {
    let lastTask;
    while (true) {
      let action = yield take([
        SCENESWITCH_LOAD_ASYNCSCENE,
        SCENESWITCH_SWITCH_SCENE
      ]);
      if (action.sceneSwitchKey === ctx.sceneSwitchReducerKey) {
        if (lastTask && lastTask.isRunning()) {
          yield cancel(lastTask);
        }
        if (action.type === SCENESWITCH_LOAD_ASYNCSCENE) {
          lastTask = yield fork(sceneSwitchLoadAsyncScene, action);
        } else {
          lastTask = yield fork(sceneSwitchSwitchScene, action);
        }
      }
    }
  });
}

function* initSceneSwitchSaga({ reducerKey, setSagaTask }) {
  let sagaTask = yield fork(forkSagaWithContext, {
    sceneSwitchReducerKey: reducerKey
  });
  setSagaTask(sagaTask);
}

function* killSceneSwitchSaga({ sagaTaskPromise }) {
  let sagaTask = yield sagaTaskPromise;
  if (sagaTask) yield cancel(sagaTask);
}

export default function* saga() {
  yield takeEvery(SCENESWITCH_INIT_SAGA, initSceneSwitchSaga);
  yield takeEvery(SCENESWITCH_KILL_SAGA, killSceneSwitchSaga);
}
