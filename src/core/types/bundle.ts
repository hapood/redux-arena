import { ComponentType } from "react";
import { ActionCreatorsMapObject } from "redux";
import { ActionsDict } from "./actions";
import { SceneReducer } from "./reducer";
import { RootState } from "../reducers/types";

export type StateDict = { [key: string]: {} };

export type PropsPicker<P, PP extends Partial<P>> = (
  stateDict: StateDict,
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
  propsPicker?: PropsPicker<P, PP>;
  saga?: (...params: any[]) => any;
  reducer?: SceneReducer<S>;
  options?: SceneBundleOptions;
};

export type SceneBundleThunk<P, S, PP> = () => Promise<SceneBundle<S, P, PP>>;
