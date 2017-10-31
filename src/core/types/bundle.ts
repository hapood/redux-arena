import { ComponentClass, SFC } from "react";
import { ActionCreatorsMapObject } from "redux";
import { ActionsDict } from "./actions";
import { SceneReducer } from "./reducer";
import { RootState } from "../reducers/types";

export type StateDict = { [key: string]: {} };

export type PropsPicker<CP = any> = (
  stateDict: StateDict,
  actionsDict: ActionsDict
) => Partial<CP>;

export type SceneBundleOptions = {
  reducerKey?: string;
  vReducerKey?: string;
  isSceneActions?: boolean;
  isSceneReducer?: boolean;
};

export type SceneBundle<SP, P, S> = {
  Component: ComponentClass<P> | SFC<P>;
  state?: S;
  actions?: ActionCreatorsMapObject;
  propsPicker?: PropsPicker<P>;
  saga?: (...params: any[]) => any;
  reducer?: SceneReducer<S>;
  options?: SceneBundleOptions;
};

export type SceneBundleThunk<SP = {}, P = {}, S = {}> = () => Promise<
  SceneBundle<SP, S, P>
>;
