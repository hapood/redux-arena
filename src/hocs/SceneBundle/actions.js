import {
  ARENA_SWITCH_LOAD_SCENE,
  ARENA_SWITCH_LOAD_ASYNCSCENE,
  ARENA_SCENE_CLEAR_REDUX
} from "../../core/actionTypes";
import {
  ARENA_SCENEBUNDLE_LOAD_START,
  ARENA_SCENEBUNDLE_LOAD_COMPLETE,
  ARENA_SCENEBUNDLE_UNMOUNT_START
} from "../../actionTypes";

export function arenaLoadScene(
  parentArenaReducerDict,
  sceneBundle,
  notifyData
) {
  return {
    type: ARENA_SWITCH_LOAD_SCENE,
    parentArenaReducerDict,
    sceneBundle,
    notifyAction: {
      arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
      arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
      sceneBundle,
      notifyData
    }
  };
}

export function arenaLoadAsyncScene(
  parentArenaReducerDict,
  asyncSceneBundle,
  notifyData
) {
  return {
    type: ARENA_SWITCH_LOAD_ASYNCSCENE,
    parentArenaReducerDict,
    asyncSceneBundle,
    notifyAction: {
      arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
      arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
      asyncSceneBundle,
      notifyData
    }
  };
}

export function sceneLoadStart(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData
) {
  return {
    type: ARENA_SCENEBUNDLE_LOAD_START,
    arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
    arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
    sceneBundle,
    asyncSceneBundle,
    notifyData
  };
}

export function sceneStartPlay(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData
) {
  return {
    type: ARENA_SCENEBUNDLE_LOAD_COMPLETE,
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
