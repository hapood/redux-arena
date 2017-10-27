import { ComponentClass, SFC } from "react";
import { ActionCreatorsMapObject } from "redux";
import { ReducerDict } from "./reducerDict";
import { SceneReducer } from "./reducer";
import { RootState } from "../reducers/types";

export type PropsPicker<S, AS extends RootState, CP> = (
  state: S,
  actions: ActionCreatorsMapObject,
  allState: AS,
  reducerDict: ReducerDict
) => { [P in keyof CP]: CP[P] };

export type SceneBundleOptions = {
  reducerKey?: string;
  vReducerKey?: string;
  isSceneActions?: boolean;
  isSceneReducer?: boolean;
};

export type SceneBundle<P = {}, S = {}, CP = any> = {
  Component: ComponentClass<P> | SFC<P>;
  state?: S;
  actions?: ActionCreatorsMapObject;
  propsPicker?: PropsPicker<S, any, CP>;
  saga?: (...params: any[]) => any;
  reducer?: SceneReducer<S>;
  options?: SceneBundleOptions;
};

export type SceneBundleThunk<P = {}, S = {}> = () => Promise<SceneBundle<S, P>>;
