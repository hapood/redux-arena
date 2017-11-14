import { ActionCreatorsMapObject } from "redux";
import ActionTypes from "../../core/ActionTypes";
import { CurtainLoadSceneAction, ReducerDict, SceneBundle } from "../../core";

export function curtainLoadScene<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
>(
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle<P, S, A, PP>,
  isInitial: any,
  loadedCb: () => void
): CurtainLoadSceneAction<P, S, A, PP> {
  return {
    type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE,
    arenaReducerDict,
    sceneBundle,
    isInitial,
    loadedCb
  };
}

export default { curtainLoadScene };
