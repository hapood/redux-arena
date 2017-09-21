import {
  ARENA_CURTAIN_LOAD_SCENE,
  ARENA_CURTAIN_LOAD_ASYNCSCENE
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
    type: ARENA_CURTAIN_LOAD_SCENE,
    parentArenaReducerDict,
    sceneBundle,
    isInitial,
    notifyAction: {
      arenaCurtainReducerKey: parentArenaReducerDict._curCurtain.reducerKey,
      arenaCurtainVReducerKey: parentArenaReducerDict._curCurtain.vReducerKey,
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
    type: ARENA_CURTAIN_LOAD_ASYNCSCENE,
    parentArenaReducerDict,
    asyncSceneBundle,
    isInitial,
    notifyAction: {
      arenaSwitchReducerKey: parentArenaReducerDict._curSwitch.reducerKey,
      arenaSwitchVReducerKey: parentArenaReducerDict._curSwitch.vReducerKey,
      arenaCurtainReducerKey: parentArenaReducerDict._curCurtain.reducerKey,
      arenaCurtainVReducerKey: parentArenaReducerDict._curCurtain.vReducerKey,
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
    arenaCurtainReducerKey: parentArenaReducerDict._curCurtain.reducerKey,
    arenaCurtainVReducerKey: parentArenaReducerDict._curCurtain.vReducerKey,
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
    arenaCurtainReducerKey: parentArenaReducerDict._curCurtain.reducerKey,
    arenaCurtainVReducerKey: parentArenaReducerDict._curCurtain.vReducerKey,
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
    arenaCurtainReducerKey: parentArenaReducerDict._curCurtain.reducerKey,
    arenaCurtainVReducerKey: parentArenaReducerDict._curCurtain.vReducerKey,
    sceneBundle,
    asyncSceneBundle,
    notifyData
  };
}
