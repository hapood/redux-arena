import { ActionCreatorsMapObject } from "redux";
import ActionTypes from "../ActionTypes";
import { ReducerDict } from "./reducerDict";
import { SceneBundle } from "./bundle";

export type CurtainLoadSceneAction<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> = {
  type: ActionTypes.ARENA_CURTAIN_LOAD_SCENE;
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle<P, S, A, PP>;
  isInitial: boolean;
  loadedCb: () => void;
};

export type DefaultSceneActions<S = {}> = {
  setState: (state: S) => void;
};

export type ActionsDict<A extends ActionCreatorsMapObject, D = {}> = {
  _arenaScene: A;
  $0: A;
} & D;
