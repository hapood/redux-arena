import ActionTypes from "../ActionTypes";
import { ReducerDict } from "./reducerDict";
import { SceneBundle } from "./bundle";

export type CurtainLoadSceneAction<P, S, PP> = {
  type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE;
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle<P, S, PP>;
  isInitial: boolean;
  loadedCb: () => void;
};

export type DefaultSceneActions<S = {}> = {
  setState: (state: S) => void;
};

export type ConnectedAction = (...params: any[]) => void;

export type ActionsDict = Record<string, Record<string, ConnectedAction>>;
