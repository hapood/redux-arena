import { SFC } from "react";
import { ActionCreatorsMapObject } from "redux";
import { SceneBundle, ReducerDict, SceneBundleOptions } from "../../types";

export type CurtainReduxInfo = {
  reducerKey: string;
  state?: {} | null | undefined;
  origArenaReducerDict: ReducerDict;
  actions: ActionCreatorsMapObject | null | undefined;
  options: SceneBundleOptions;
  saga: (...params: any[]) => any;
  bindedActions: ActionCreatorsMapObject;
  arenaReducerDict: ReducerDict;
};

export type CurtainMutableObj = {
  isObsolete: boolean;
};

export type CurtainState<P = {}, RS = {}> = {
  PlayingScene: SFC<P> | null | undefined;
  curSceneBundle: SceneBundle<P, RS> | null | undefined;
  reduxInfo: CurtainReduxInfo | null | undefined;
  mutableObj: CurtainMutableObj;
};
