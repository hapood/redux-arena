import { ARENA_CURTAIN_LOAD_SCENE } from "../../core/actionTypes";

export function arenaLoadScene(
  parentArenaReducerDict,
  sceneBundle,
  isInitial,
  loadedCb
) {
  return {
    type: ARENA_CURTAIN_LOAD_SCENE,
    parentArenaReducerDict,
    sceneBundle,
    isInitial,
    loadedCb
  };
}
