import * as React from "react";
import { ActionCreatorsMapObject } from "redux";
import { SceneBundle } from "../core";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import { Omit } from "./types";

export default function<P extends PP, S, A extends ActionCreatorsMapObject, PP>(
  bundle: SceneBundle<P, S, A, PP>,
  extraProps?: ArenaSceneExtraProps
) {
  let WrapperClass: React.SFC<Omit<P, keyof PP>> = props => (
    <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />
  );
  WrapperClass.displayName = "ScenePropsProxy";
  return WrapperClass;
}
