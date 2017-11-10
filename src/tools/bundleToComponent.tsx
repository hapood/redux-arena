import * as React from "react";
import { SceneBundle } from "../core";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import { Omit } from "./types";

export default function<P extends PP, S, PP>(
  bundle: SceneBundle<P, S, PP>,
  extraProps?: ArenaSceneExtraProps
) {
  let WrapperClass: React.SFC<Omit<P, keyof PP>> = props => (
    <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />
  );
  WrapperClass.displayName = "ScenePropsProxy";
  return WrapperClass;
}
