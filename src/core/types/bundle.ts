import { ComponentType } from "react";
import { ActionCreatorsMapObject } from "redux";
import { ActionsDict } from "./actions";
import { SceneReducer } from "./reducer";
import { CurtainState } from "../reducers";
import { RootState } from "../reducers/types";

export type StateDict<S, D = {}> = {
  _arenaScene: S;
  _arenaCurtain: CurtainState<S>;
  $0: S;
} & D;

export type PropsPicker<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> = (stateDict: StateDict<S, any>, actionsDict: ActionsDict<A, any>) => PP;

export type SceneBundleOptions = {
  reducerKey?: string;
  vReducerKey?: string;
  isSceneActions?: boolean;
  isSceneReducer?: boolean;
};

export type SceneBundle<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> = {
  Component: ComponentType<P>;
  state: S;
  actions: A;
  propsPicker: PropsPicker<P, S, A, PP>;
  saga?: (...params: any[]) => any;
  reducer: SceneReducer<S>;
  options?: SceneBundleOptions;
};
