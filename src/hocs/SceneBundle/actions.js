import {
  ARENA_SWITCH_LOAD_SCENE,
  ARENA_SWITCH_LOAD_ASYNCSCENE,
  ARENA_SCENE_CLEAR_REDUX
} from "../../core/actionTypes";
import {
  ARENA_SCENEBUNDLE_LOAD_START,
  ARENA_SCENEBUNDLE_PLAY_START,
  ARENA_SCENEBUNDLE_UNMOUNT_START
} from "../../actionTypes";

export function arenaLoadScene(
  parentArenaReducerDict,
  sceneBundle,
  notifyData,
  isInitial
) {
  return {
    type: ARENA_SWITCH_LOAD_SCENE,
    parentArenaReducerDict,
    sceneBundle,
    isInitial,
    notifyAction: {
      arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
      arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
      sceneBundle,
      notifyData,
      isInitial
    }
  };
}

export function arenaLoadAsyncScene(
  parentArenaReducerDict,
  asyncSceneBundle,
  notifyData,
  isInitial
) {
  return {
    type: ARENA_SWITCH_LOAD_ASYNCSCENE,
    parentArenaReducerDict,
    asyncSceneBundle,
    isInitial,
    notifyAction: {
      arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
      arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
      asyncSceneBundle,
      notifyData,
      isInitial
    }
  };
}

export function sceneLoadStart(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData,
  isInitial
) {
  return {
    type: ARENA_SCENEBUNDLE_LOAD_START,
    arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
    arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
    sceneBundle,
    asyncSceneBundle,
    notifyData,
    isInitial
  };
}

export function sceneStartPlay(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData
) {
  return {
    type: ARENA_SCENEBUNDLE_PLAY_START,
    arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
    arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
    sceneBundle,
    asyncSceneBundle,
    notifyData
  };
}

export function sceneStopPlay(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData
) {
  return {
    type: ARENA_SCENEBUNDLE_UNMOUNT_START,
    arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
    arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
    sceneBundle,
    asyncSceneBundle,
    notifyData
  };
}

export function clearSceneRedux(arenaSwitchReducerKey, reduxInfo) {
  return {
    type: ARENA_SCENE_CLEAR_REDUX,
    arenaSwitchReducerKey,
    reduxInfo
  };
}
