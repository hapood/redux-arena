import {
  SCENESWITCH_SWITCH_SCENE,
  SCENESWITCH_REPLACE_STATE,
  SCENE_REPLACE_STATE,
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
import createSenceReducer from "../reducers/createSenceReducer";
import { connect } from "react-redux";
import bindActionCreators from "../../enhencedRedux/bindActionCreators";

function* sceneApplyRedux({ sceneKey, state, saga, reducer }) {
  if (reducer)
    window.arenaStore.replaceReducers({
      [sceneKey]: createSenceReducer(reducer)
    });
  if (saga) yield fork(saga);
  yield put({
    type: SCENE_REPLACE_STATE,
    state
  });
}

function* arenaSwitchScene({
  sceneSwitchKey,
  sceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
}) {
  let ctxSceneSwitchKey = yield getContext("sceneSwitchKey");
  if (ctxSceneSwitchKey !== sceneSwitchKey) return;
  let mapDispatchToProps;
  if (sceneBundle.actions) {
    mapDispatchToProps = dispatch =>
      bindActionCreators(sceneBundle.actions, dispatch, "scene");
  }
  let PlayingScene = connect(
    state => sceneBundle.mapStateToProps(state, "scene"),
    mapDispatchToProps
  )(sceneBundle.Component);
  let newArenaState = {
    match: sceneBundle.match,
    location: sceneBundle.location,
    PlayingScene,
    sceneNo: OldPlayingScene === sceneBundle.Component ? sceneNo + 1 : 0
  };
  yield* sceneApplyRedux({
    sceneKey: "scene",
    state: sceneBundle.state,
    saga: sceneBundle.saga,
    reducer: sceneBundle.reducer
  });
  yield put({
    type: SCENESWITCH_REPLACE_STATE,
    sceneSwitchKey,
    state: newArenaState
  });
}

function* arenaLoadAsyncScene({
  sceneSwitchKey,
  asyncSceneBundle,
  match,
  location,
  OldPlayingScene,
  sceneNo
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
    sceneNo
  });
}

function* forkSagaWithCotext(ctx) {
  yield setContext(ctx);
  yield takeEvery(SCENESWITCH_SWITCH_SCENE, arenaSwitchScene);
  yield takeEvery(SCENESWITCH_LOAD_ASYNCSCENE, arenaLoadAsyncScene);
}

function* initSceneSwitchSaga({ sceneSwitchKey, setSagaTask }) {
  let sagaTask = yield fork(forkSagaWithCotext, { sceneSwitchKey });
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
