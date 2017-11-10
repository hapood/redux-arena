import { SFC } from "react";
import { ActionCreatorsMapObject } from "redux";
import { SceneBundle, ReducerDict, SceneBundleOptions } from "../../types";

export type CurtainReduxInfo<S> = {
  reducerKey: string;
  state?: S | null | undefined;
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

export type CurtainState<
  P = {},
  S = {},
  A extends ActionCreatorsMapObject = {},
  PP = {}
> = {
  PlayingScene: SFC<P> | null | undefined;
  curSceneBundle: SceneBundle<P, S, A, PP> | null | undefined;
  reduxInfo: CurtainReduxInfo<S> | null | undefined;
  mutableObj: CurtainMutableObj;
};
