import * as React from "react";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import { SceneBundle } from "../core";

export default function<SP, P, S>(
  bundle: SceneBundle<SP, P, S>,
  props?: SP,
  extraProps?: ArenaSceneExtraProps
) {
  return <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />;
}
