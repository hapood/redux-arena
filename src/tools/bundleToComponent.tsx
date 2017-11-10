import * as React from "react";
import { ActionCreatorsMapObject } from "redux";
import { SceneBundle } from "../core";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import { Omit, SceneBundleNoS, SceneBundleNoA, SceneBundleNoPP } from "./types";
import { defaultPropsPicker } from "./commons";

function isActionsEmpty(
  actions: ActionCreatorsMapObject | undefined
): actions is ActionCreatorsMapObject {
  return actions != null;
}

function bundleToComponent<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
>(
  bundle: SceneBundle<P, S, A, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof PP>>;
function bundleToComponent<P extends PP, A extends ActionCreatorsMapObject, PP>(
  bundle: SceneBundleNoS<P, A, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof PP>>;
function bundleToComponent<P extends PP, S, PP>(
  bundle: SceneBundleNoA<P, S, PP>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof PP>>;
function bundleToComponent<P extends S, S, A extends ActionCreatorsMapObject>(
  bundle: SceneBundleNoPP<P, S, A>,
  extraProps?: ArenaSceneExtraProps
): React.SFC<Omit<P, keyof S>>;
function bundleToComponent(
  bundle: any,
  extraProps?: ArenaSceneExtraProps
): any {
  let newBundle= Object.assign({}, {}, bundle);
  let WrapperClass: React.SFC<Omit<P, keyof PP>> = props => (
    <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />
  );
  WrapperClass.displayName = "ScenePropsProxy";
  return WrapperClass as any;
}
export default bundleToComponent;
