import { ComponentType } from "react";
import { ActionCreatorsMapObject } from "redux";
import { ActionsDict } from "./actions";
import { SceneReducer } from "./reducer";
import { CurtainState } from "../reducers";
import { RootState } from "../reducers/types";

export type StateDict<S> = {
  [key: string]: {};
  _arenaScene: S;
  _arenaCurtain: CurtainState;
  $0: S;
};

export type PropsPicker<P, S, PP extends Partial<P>> = (
  stateDict: StateDict<S>,
  actionsDict: ActionsDict
) => PP;

export type SceneBundleOptions = {
  reducerKey?: string;
  vReducerKey?: string;
  isSceneActions?: boolean;
  isSceneReducer?: boolean;
};

export type SceneBundle<P, S, PP> = {
  Component: ComponentType<P>;
  state?: S;
  actions?: ActionCreatorsMapObject;
  propsPicker?: PropsPicker<P, S, PP>;
  saga?: (...params: any[]) => any;
  reducer?: SceneReducer<S>;
  options?: SceneBundleOptions;
};

export type SceneBundleThunk<P, S, PP> = () => Promise<SceneBundle<S, P, PP>>;
