import { ComponentClass } from "react";
import { ActionCreatorsMapObject } from "redux";
import { ReducerDict } from "./reducerDict";
import { SceneReducer } from "./reducer";

export type PropsPicker<S, AS> = (
  state: S,
  actions: ActionCreatorsMapObject,
  allState: AS,
  reducerDict: ReducerDict
) => S;

export type SceneBundleOptions = {
  reducerKey?: string;
  vReducerKey?: string;
  isSceneActions?: boolean;
  isSceneReducer?: boolean;
};

export type SceneBundle = {
  Component: ComponentClass;
  state: any;
  actions: ActionCreatorsMapObject;
  propsPicker: PropsPicker<any, any>;
  saga: () => null;
  reducer: SceneReducer<any>;
  options?: SceneBundleOptions;
};
