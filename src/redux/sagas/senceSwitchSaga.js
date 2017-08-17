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
  setContext,
  getContext
} from "redux-saga/effects";
import { connect } from "react-redux";
import bindActionCreators from "../../enhencedRedux/bindActionCreators";
import { sceneApplyRedux } from "./sceneSaga";

function* sceneSwitchSwitchScene({
  sceneSwitchKey,
  sceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo,
  setReduxInfo
}) {
  let ctxSceneSwitchKey = yield getContext("sceneSwitchKey");
  if (ctxSceneSwitchKey !== sceneSwitchKey) return;
  let mapDispatchToProps;
  let reducerKey = yield* sceneApplyRedux({
    reducerKey: sceneBundle.reducerKey,
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer,
    setReduxInfo
  });
  if (sceneBundle.actions) {
    mapDispatchToProps = dispatch =>
      bindActionCreators(sceneBundle.actions, dispatch, reducerKey);
  }
  let PlayingScene = connect(
    state => sceneBundle.mapStateToProps(state, reducerKey),
    mapDispatchToProps
  )(sceneBundle.Component);
  let newArenaState = {
    match: sceneBundle.match,
    location: sceneBundle.location,
    PlayingScene,
    sceneNo: OldPlayingScene === sceneBundle.Component ? sceneNo + 1 : 0
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
  match,
  location,
  OldPlayingScene,
  sceneNo,
  setReduxInfo
}) {
  let ctxSceneSwitchKey = yield getContext("sceneSwitchKey");
  if (ctxSceneSwitchKey !== sceneSwitchKey) return;
  let sceneBundle = yield asyncSceneBundle;
  yield put({
    type: SCENE_LOAD_END,
    match,
    location,
    asyncSceneBundle
  });
  sceneBundle = sceneBundle.default ? sceneBundle.default : sceneBundle;
  yield put({
    type: SCENESWITCH_SWITCH_SCENE,
    sceneSwitchKey,
    sceneBundle,
    match,
    location,
    OldPlayingScene,
    sceneNo,
    setReduxInfo
  });
}

function* forkSagaWithCotext(ctx) {
  yield setContext(ctx);
  yield takeEvery(SCENESWITCH_SWITCH_SCENE, sceneSwitchSwitchScene);
  yield takeEvery(SCENESWITCH_LOAD_ASYNCSCENE, sceneSwitchLoadAsyncScene);
}

function* initSceneSwitchSaga({ reducerKey, setSagaTask }) {
  let sagaTask = yield fork(forkSagaWithCotext, { sceneSwitchKey: reducerKey });
  setSagaTask(sagaTask);
}

function* killSceneSwitchSaga({ sagaTaskPromise }) {
  let sagaTask = yield sagaTaskPromise;
  yield cancel(sagaTask);
}

export default function* saga() {
  yield takeEvery(SCENESWITCH_INIT_SAGA, initSceneSwitchSaga);
  yield takeEvery(SCENESWITCH_KILL_SAGA, killSceneSwitchSaga);
}
