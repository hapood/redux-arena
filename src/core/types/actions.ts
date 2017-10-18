import { actionTypes } from "../actionTypes";
import { ReducerDict } from "./reducerDict";
import { SceneBundle } from "./bundle";

export type LoadSceneAction = {
  type: actionTypes.ARENA_CURTAIN_LOAD_SCENE;
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle;
  isInitial: boolean;
  loadedCb: () => void;
};
