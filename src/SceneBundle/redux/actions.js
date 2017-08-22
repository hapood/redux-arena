import {
  SCENESWITCH_SWITCH_SCENE,
  SCENESWITCH_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_PLAY_START,
  SCENE_PLAY_END,
  SCENE_LOAD_END,
  SCENE_CLEAR_REDUX
} from "../../redux/actionTypes";

export function sceneSwitchLoadScene(sceneSwitchKey, sceneBundle) {
  return {
    type: SCENESWITCH_SWITCH_SCENE,
    sceneSwitchKey,
    sceneBundle
  };
}

export function arenaLoadAsyncScene(sceneSwitchKey, asyncSceneBundle) {
  return {
    type: SCENESWITCH_LOAD_ASYNCSCENE,
    sceneSwitchKey,
    asyncSceneBundle
  };
}

export function sceneLoadStart(sceneSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_START,
    sceneSwitchKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStartPlay(sceneSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_START,
    sceneSwitchKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneLoadEnd(sceneSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_LOAD_END,
    sceneSwitchKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStopPlay(sceneSwitchKey, sceneBundle, asyncSceneBundle) {
  return {
    type: SCENE_PLAY_END,
    sceneSwitchKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function clearSceneRedux(reduxInfo) {
  return {
    type: SCENE_CLEAR_REDUX,
    reduxInfo
  };
}
