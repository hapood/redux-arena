import ActionTypes from "../../core/ActionTypes";
import { CurtainLoadSceneAction, ReducerDict, SceneBundle } from "../../core";

export function curtainLoadScene<P, S, PP>(
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle<P, S, PP>,
  isInitial: any,
  loadedCb: () => void
): CurtainLoadSceneAction<P, S, PP> {
  return {
    type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE,
    arenaReducerDict,
    sceneBundle,
    isInitial,
    loadedCb
  };
}

export default { curtainLoadScene };
