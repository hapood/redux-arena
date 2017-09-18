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
      arenaReducerDict: parentArenaReducerDict,
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
      arenaReducerDict: parentArenaReducerDict,
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
    arenaReducerDict: parentArenaReducerDict,
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
    arenaReducerDict: parentArenaReducerDict,
    sceneBundle,
    asyncSceneBundle: sceneBundle ? undefined : asyncSceneBundle,
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
    arenaReducerDict: parentArenaReducerDict,
    sceneBundle,
    asyncSceneBundle: sceneBundle ? undefined : asyncSceneBundle,
    notifyData
  };
}
