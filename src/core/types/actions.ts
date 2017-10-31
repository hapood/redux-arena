import ActionTypes from "../ActionTypes";
import { ReducerDict } from "./reducerDict";
import { SceneBundle } from "./bundle";

export type CurtainLoadSceneAction<P, S, CP> = {
  type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE;
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle<P, S, CP>;
  isInitial: boolean;
  loadedCb: () => void;
};

export type DefaultSceneActions<S = {}> = {
  setState: (state: S) => void;
};

export type ConnectedAction = (...params: any[]) => void;

export type ActionsDict = {
  [key: string]: {
    [key: string]: ConnectedAction;
  };
};
