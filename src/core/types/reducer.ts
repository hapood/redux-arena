import { AnyAction } from "redux";
export type SceneReducer<S> = (
  state: S,
  action: AnyAction,
  isSceneAction: boolean
) => S;

export type ReducerFactory = (reducerKey: string) => SceneReducer<{}>;
