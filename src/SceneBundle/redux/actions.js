import {
  ARENA_SWITCH_LOAD_SCENE,
  ARENA_SWITCH_LOAD_ASYNCSCENE,
  ARENA_SCENE_LOAD_START,
  ARENA_SCENE_PLAY_START,
  ARENA_SCENE_PLAY_END,
  ARENA_SCENE_LOAD_END,
  ARENA_SCENE_CLEAR_REDUX
} from "../../redux/actionTypes";

export function arenaLoadScene(parentArenaReducerDict, sceneBundle) {
  return {
    type: ARENA_SWITCH_LOAD_SCENE,
    parentArenaReducerDict,
    sceneBundle
  };
}

export function arenaLoadAsyncScene(parentArenaReducerDict, asyncSceneBundle) {
  return {
    type: ARENA_SWITCH_LOAD_ASYNCSCENE,
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
    type: ARENA_SCENE_LOAD_START,
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
    type: ARENA_SCENE_PLAY_START,
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
    type: ARENA_SCENE_LOAD_END,
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
    type: ARENA_SCENE_PLAY_END,
    arenaSwitchReducerKey,
    sceneBundle,
    asyncSceneBundle
  };
}

export function clearSceneRedux(arenaSwitchReducerKey, reduxInfo) {
  return {
    type: ARENA_SCENE_CLEAR_REDUX,
    arenaSwitchReducerKey,
    reduxInfo
  };
}
