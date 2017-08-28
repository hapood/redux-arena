import {
  ARENASWITCH_LOAD_SCENE,
  ARENASWITCH_LOAD_ASYNCSCENE,
  SCENE_LOAD_START,
  SCENE_PLAY_START,
  SCENE_PLAY_END,
  SCENE_LOAD_END,
  SCENE_CLEAR_REDUX
} from "../../redux/actionTypes";

export function arenaLoadScene(parentArenaReducerDict, sceneBundle) {
  return {
    type: ARENASWITCH_LOAD_SCENE,
    parentArenaReducerDict,
    sceneBundle
  };
}

export function arenaLoadAsyncScene(parentArenaReducerDict, asyncSceneBundle) {
  return {
    type: ARENASWITCH_LOAD_ASYNCSCENE,
    parentArenaReducerDict,
    asyncSceneBundle
  };
}

export function sceneLoadStart(
  arenaSwitchReducerKey,
  sceneBundle,
  asyncSceneBundle
) {
  return {
    type: SCENE_LOAD_START,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStartPlay(
  arenaSwitchReducerKey,
  sceneBundle,
  asyncSceneBundle
) {
  return {
    type: SCENE_PLAY_START,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneLoadEnd(
  arenaSwitchReducerKey,
  sceneBundle,
  asyncSceneBundle
) {
  return {
    type: SCENE_LOAD_END,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function sceneStopPlay(
  arenaSwitchReducerKey,
  sceneBundle,
  asyncSceneBundle
) {
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
