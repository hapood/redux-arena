import { AnyAction } from "redux";
export type SceneReducer<S = {}> = (
  state: S,
  action: AnyAction,
  sceneReducerKey: string
) => S;

export type ReducerFactory = (reducerKey: string) => SceneReducer<any>;
