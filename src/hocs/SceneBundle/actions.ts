import { actionTypes } from "../../core/actionTypes";
import { LoadSceneAction, ReducerDict, SceneBundle } from "../../core";

export function arenaLoadScene(
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle,
  isInitial: any,
  loadedCb: () => void
): LoadSceneAction {
  return {
    type: actionTypes.ARENA_CURTAIN_LOAD_SCENE,
    arenaReducerDict,
    sceneBundle,
    isInitial,
    loadedCb
  };
}

export default { arenaLoadScene };
