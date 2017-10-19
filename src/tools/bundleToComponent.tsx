import * as React from "react";
import { SceneBundle } from "../core";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";

export default function<SP, SS>(
  bundle: SceneBundle<SP, SS>,
  extraProps: ArenaSceneExtraProps
) {
  let WrapperClass: React.SFC = (props: SP) => (
    <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />
  );
  WrapperClass.displayName = "ScenePropsProxy";
  return WrapperClass;
}
