import {
  ARENASWITCH_SWITCH_SCENE,
  ARENASWITCH_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_PLAY_START,
  SCENE_PLAY_END,
  SCENE_LOAD_END,
  SCENE_CLEAR_REDUX
} from "../../redux/actionTypes";

export function arenaSwitchLoadScene(arenaSwitchKey, sceneBundle) {
  return {
    type: ARENASWITCH_SWITCH_SCENE,
    arenaSwitchKey,
    sceneBundle
  };
}

export function arenaLoadAsyncScene(arenaSwitchKey, asyncSceneBundle) {
  return {
    type: ARENASWITCH_LOAD_ASYNCSCENE,
    arenaSwitchKey,
    asyncSceneBundle
  };
}

export function sceneLoadStart(arenaSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_START,
    arenaSwitchKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStartPlay(arenaSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_START,
    arenaSwitchKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneLoadEnd(arenaSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_END,
    arenaSwitchKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStopPlay(arenaSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_END,
    arenaSwitchKey,
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
