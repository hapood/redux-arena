import ActionTypes from "../../core/ActionTypes";
import { CurtainLoadSceneAction, ReducerDict, SceneBundle } from "../../core";

export type CurtainLoadScene = (
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle,
  isInitial: any,
  loadedCb: () => void
) => CurtainLoadSceneAction;

export const curtainLoadScene: CurtainLoadScene = function(
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle,
  isInitial: any,
  loadedCb: () => void
): CurtainLoadSceneAction {
  return {
    type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE,
    arenaReducerDict,
    sceneBundle,
    isInitial,
    loadedCb
  };
};

export default { curtainLoadScene };
