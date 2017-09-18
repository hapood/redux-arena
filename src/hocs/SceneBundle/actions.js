import {
  ARENA_CURTAIN_LOAD_SCENE,
  ARENA_CURTAIN_LOAD_ASYNCSCENE
} from "../../core/actionTypes";
import {
  ARENA_SCENEBUNDLE_LOAD_START,
  ARENA_SCENEBUNDLE_PLAY_START,
  ARENA_SCENEBUNDLE_UNMOUNT_START
} from "../../actionTypes";

function chooseBundle(sceneBundle, asyncSceneBundle) {
  return sceneBundle ? { sceneBundle } : { asyncSceneBundle };
}

export function arenaLoadScene(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData,
  isInitial
) {
  let bundleObj = chooseBundle(sceneBundle, asyncSceneBundle);
  if (bundleObj.sceneBundle) {
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
  } else {
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
}

export function sceneLoadStart(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData,
  isInitial
) {
  return Object.assign(
    {
      type: ARENA_SCENEBUNDLE_LOAD_START,
      arenaReducerDict: parentArenaReducerDict,
      notifyData,
      isInitial
    },
    chooseBundle(sceneBundle, asyncSceneBundle)
  );
}

export function sceneStartPlay(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData
) {
  return Object.assign(
    {
      type: ARENA_SCENEBUNDLE_PLAY_START,
      arenaReducerDict: parentArenaReducerDict,
      notifyData
    },
    chooseBundle(sceneBundle, asyncSceneBundle)
  );
}

export function sceneStopPlay(
  parentArenaReducerDict,
  sceneBundle,
  asyncSceneBundle,
  notifyData
) {
  return Object.assign(
    {
      type: ARENA_SCENEBUNDLE_UNMOUNT_START,
      arenaReducerDict: parentArenaReducerDict,
      notifyData
    },
    chooseBundle(sceneBundle, asyncSceneBundle)
  );
}
