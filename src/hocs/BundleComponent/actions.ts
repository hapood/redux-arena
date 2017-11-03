import ActionTypes from "../../core/ActionTypes";
import { CurtainLoadSceneAction, ReducerDict, SceneBundle } from "../../core";

export function curtainLoadScene<P, S, CP>(
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle<P, S, CP>,
  isInitial: any,
  loadedCb: () => void
): CurtainLoadSceneAction<P, S, CP> {
  return {
    type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE,
    arenaReducerDict,
    sceneBundle,
    isInitial,
    loadedCb
  };
}

export default { curtainLoadScene };
