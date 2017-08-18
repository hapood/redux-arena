import {
  SCENESWITCH_SWITCH_SCENE,
  SCENESWITCH_REPLACE_STATE,
  SCENE_LOAD_END,
  SCENESWITCH_LOAD_ASYNCSCENE,
  SCENESWITCH_INIT_SAGA,
  SCENESWITCH_KILL_SAGA
} from "../actionTypes";
import {
  takeEvery,
  takeLatest,
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
import bindActionCreators from "../../enhencedRedux/bindActionCreators";
import { sceneApplyRedux } from "./sceneSaga";

function* sceneSwitchSwitchScene({
  sceneSwitchKey,
  sceneBundle,
  OldPlayingScene,
  sceneNo,
  curSceneBundle,
  reduxInfoPromise,
  resolveReduxInfo,
  resolveObsoleteReduxInfo
}) {
  let ctxSceneSwitchKey = (yield getContext("sceneSwitchCtx")).reducerKey;
  if (ctxSceneSwitchKey !== sceneSwitchKey) return;
  let mapDispatchToProps;
  let reducerKey = yield* sceneApplyRedux({
    reducerKey: sceneBundle.reducerKey,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    curSceneBundle,
    reduxInfoPromise,
    resolveReduxInfo,
    resolveObsoleteReduxInfo
  });
  if (sceneBundle.actions) {
    mapDispatchToProps = dispatch =>
      bindActionCreators(sceneBundle.actions, dispatch, reducerKey);
  }
  let mapStateToProps;
  if (sceneBundle.mapStateToProps) {
    mapStateToProps = state => sceneBundle.mapStateToProps(state, reducerKey);
  }
  let PlayingScene = connect(mapStateToProps, mapDispatchToProps)(
    sceneBundle.Component
  );
  let newArenaState = {
    PlayingScene,
    sceneNo: OldPlayingScene === sceneBundle.Component ? sceneNo + 1 : 0,
    curSceneBundle: sceneBundle
  };
  yield put({
    type: SCENESWITCH_REPLACE_STATE,
    sceneSwitchKey,
    state: newArenaState
  });
}

function* sceneSwitchLoadAsyncScene({
  sceneSwitchKey,
  asyncSceneBundle,
  OldPlayingScene,
  sceneNo,
  curSceneBundle,
  reduxInfoPromise,
  resolveReduxInfo,
  resolveObsoleteReduxInfo
}) {
  let sceneBundle;
  try {
    sceneBundle = yield asyncSceneBundle;
  } finally {
    if (yield cancelled()) {
      resolveObsoleteReduxInfo({});
    }
  }
  yield put({
    type: SCENE_LOAD_END,
    asyncSceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield* sceneSwitchSwitchScene({
    sceneSwitchKey,
    sceneBundle,
    OldPlayingScene,
    sceneNo,
    curSceneBundle,
    reduxInfoPromise,
    resolveReduxInfo,
    resolveObsoleteReduxInfo
  });
}

function* forkSagaWithCotext(ctx) {
  yield setContext(ctx);
  yield fork(function*() {
    let lastTask, lastAction;
    while (true) {
      let action = yield take([
        SCENESWITCH_LOAD_ASYNCSCENE,
        SCENESWITCH_SWITCH_SCENE
      ]);
      if (action.sceneSwitchKey === ctx.sceneSwitchCtx.reducerKey) {
        if (lastTask && lastTask.isRunning()) {
          yield cancel(lastTask);
          action = Object.assign({}, action, {
            reduxInfoPromise: lastAction.reduxInfoPromise
          });
        }
        lastAction = action;
        if (action.type === SCENESWITCH_LOAD_ASYNCSCENE) {
          lastTask = yield fork(sceneSwitchLoadAsyncScene, action);
        } else {
          lastTask = yield fork(sceneSwitchSwitchScene, action);
        }
      }
    }
  });
}

function* initSceneSwitchSaga({ sceneSwitchCtx, setSagaTask }) {
  let sagaTask = yield fork(forkSagaWithCotext, {
    sceneSwitchCtx
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
