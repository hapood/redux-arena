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

export type SceneBundleNo<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> = {
  state: S;
  actions: A;
  propsPicker: PropsPicker<P, S, A, PP>;
} & SceneBundleBase<P, S>;

export type SceneBundleNoS<
  P extends PP,
  A extends ActionCreatorsMapObject,
  PP
> = {
  actions: A;
  propsPicker: PropsPicker<P, DefaultState, A, PP>;
} & SceneBundleBase<P, DefaultState>;

export type SceneBundleNoPP<P, S, A extends ActionCreatorsMapObject> = {
  state: S;
  actions: A;
} & SceneBundleBase<P & { actions: A }, S>;

export type SceneBundleNoA<P extends PP, S, PP> = {
  state: S;
  propsPicker: PropsPicker<P, DefaultState, DefaultActions<S>, PP>;
} & SceneBundleBase<P, S>;

export type SceneBundleNoSPP<P, A extends ActionCreatorsMapObject> = {
  actions: A;
} & SceneBundleBase<P & { actions: A }, DefaultState>;

export type SceneBundleNoSA<P extends PP, PP> = {
  propsPicker: PropsPicker<P, DefaultState, DefaultActions<DefaultState>, PP>;
} & SceneBundleBase<P, DefaultState>;

export type SceneBundleNoAPP<P, S> = {
  state: S;
} & SceneBundleBase<P, S>;

export type SceneBundleNoSAPP<P> = SceneBundleBase<P, DefaultState>;

export type SceneBundlePart<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> =
  | SceneBundleNo<P, S, A, PP>
  | SceneBundleNoS<P, A, PP>
  | SceneBundleNoPP<P, S, A>
  | SceneBundleNoA<P, S, PP>
  | SceneBundleNoSPP<P, A>
  | SceneBundleNoAPP<P, S>
  | SceneBundleNoSA<P, PP>
  | SceneBundleNoSAPP<P>;
