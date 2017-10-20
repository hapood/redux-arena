import * as React from "react";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import { SceneBundle } from "../core";

export default function<SP, SS>(
  bundle: SceneBundle<SP, SS>,
  props?: SP,
  extraProps?: ArenaSceneExtraProps
) {
  return <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />;
}
