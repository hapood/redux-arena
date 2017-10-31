import { ActionCreatorsMapObject } from "redux";

export type ReducerDictItem<S> = {
  reducerKey: string;
  vReducerKey: string | null | undefined;
  actions: ActionCreatorsMapObject;
};

export type ReducerDict = { [key: string]: ReducerDictItem<any> };
