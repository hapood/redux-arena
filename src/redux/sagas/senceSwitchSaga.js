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

function* sceneApplyRedux({ reducerKey, state, saga, reducer, setReduxInfo }) {
  let arenaStore = yield getContext("store");
  if (reducerKey) {
    let flag = arenaStore.addReducer({
      reducerKey,
      reducer: createSenceReducer(reducer)
    });
    if (flag === false)
      throw new Error(`Reducer key [${reducerKey}] is already exsited.`);
  } else {
    do {
      let reducerKey = String(Math.random()).slice(2);
      let flag = arenaStore.addReducer({
        reducerKey,
        reducer: createSenceReducer(reducer)
      });
      if (flag === false) reducerKey = null;
    } while (reducerKey == null);
  }
  let sagaTask;
  if (saga) sagaTask = yield fork(saga);
  yield put({
    type: SCENE_REPLACE_STATE,
    _sceneKey: sceneKey,
    state
  });
  setReduxInfo({ reducerKey, sagaTask });
  return reducerKey;
}

function* arenaSwitchScene({
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

function* arenaLoadAsyncScene({
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
  yield takeEvery(SCENESWITCH_SWITCH_SCENE, arenaSwitchScene);
  yield takeEvery(SCENESWITCH_LOAD_ASYNCSCENE, arenaLoadAsyncScene);
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
