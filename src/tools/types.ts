import { ComponentType } from "react";
import { ActionCreatorsMapObject } from "redux";
import { PropsPicker, SceneReducer, SceneBundleOptions } from "../core";

export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export type DefaultPickedProps<S, A extends ActionCreatorsMapObject> = {
  actions: A;
} & S;

export type DefaultState = {};

export type DefaultActions<S> = { setState: (state: Partial<S>) => void };

export type ActionsProps<A> = { actions: A };

export type SceneBundleBase<P, S> = {
  Component: ComponentType<P>;
  saga?: (...params: any[]) => any;
  options?: SceneBundleOptions;
  reducer?: SceneReducer<S>;
};

export type SceneBundleNo<P, S, A extends ActionCreatorsMapObject, PP> = {
  state: S;
  actions: A;
  propsPicker: PropsPicker<P, S, A, PP>;
} & SceneBundleBase<P, S>;

export type SceneBundleNoS<P, A extends ActionCreatorsMapObject, PP> = {
  actions: A;
  propsPicker: PropsPicker<P, DefaultState, A, PP>;
} & SceneBundleBase<P, DefaultState>;

export type SceneBundleNoPP<P, S, A extends ActionCreatorsMapObject> = {
  state: S;
  actions: A;
} & SceneBundleBase<P & { actions: A }, S>;

export type SceneBundleNoA<P, S, PP> = {
  state: S;
  propsPicker: PropsPicker<P, DefaultState, DefaultActions<S>, PP>;
} & SceneBundleBase<P, S>;

export type SceneBundleNoSPP<P, A extends ActionCreatorsMapObject> = {
  actions: A;
} & SceneBundleBase<P & { actions: A }, DefaultState>;

export type SceneBundleNoSA<P, PP> = {
  propsPicker: PropsPicker<P, DefaultState, DefaultActions<DefaultState>, PP>;
} & SceneBundleBase<P, DefaultState>;

export type SceneBundleNoAPP<P, S> = {
  state: S;
} & SceneBundleBase<P, S>;

export type SceneBundleNoSAPP<P> = SceneBundleBase<P, DefaultState>;
