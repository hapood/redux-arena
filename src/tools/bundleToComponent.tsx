import * as React from "react";
import { SceneBundle } from "../core";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";

export default function<SP, P, S>(
  bundle: SceneBundle<SP, P, S>,
  extraProps?: ArenaSceneExtraProps
) {
  let WrapperClass: React.SFC<SP> = props => (
    <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />
  );
  WrapperClass.displayName = "ScenePropsProxy";
  return WrapperClass;
}
