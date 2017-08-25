import {
  ARENASWITCH_LOAD_SCENE,
  ARENASWITCH_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_PLAY_START,
  SCENE_PLAY_END,
  SCENE_LOAD_END,
  SCENE_CLEAR_REDUX
} from "../../redux/actionTypes";

export function arenaSwitchLoadScene(arenaSwitchReducerKey, sceneBundle) {
  return {
    type: ARENASWITCH_LOAD_SCENE,
    arenaSwitchReducerKey,
    sceneBundle
  };
}

export function arenaLoadAsyncScene(arenaSwitchReducerKey, asyncSceneBundle) {
  return {
    type: ARENASWITCH_LOAD_ASYNCSCENE,
    arenaSwitchReducerKey,
    asyncSceneBundle
  };
}

export function sceneLoadStart(arenaSwitchReducerKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_START,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStartPlay(arenaSwitchReducerKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_START,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneLoadEnd(arenaSwitchReducerKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_END,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStopPlay(arenaSwitchReducerKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_END,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function clearSceneRedux(arenaSwitchReducerKey, reduxInfo) {
  return {
    type: SCENE_CLEAR_REDUX,
    arenaSwitchReducerKey,
    reduxInfo
  };
}
