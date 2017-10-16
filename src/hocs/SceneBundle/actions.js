import { ARENA_CURTAIN_LOAD_SCENE } from "../../core/actionTypes";

export function arenaLoadScene(
  arenaReducerDict,
  sceneBundle,
  isInitial,
  loadedCb
) {
  return {
    type: ARENA_CURTAIN_LOAD_SCENE,
    arenaReducerDict,
    sceneBundle,
    isInitial,
    loadedCb
  };
}
