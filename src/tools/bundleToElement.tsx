import * as React from "react";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import { SceneBundle } from "../core";
import { Omit } from "./types";

export default function<P extends PP, S, PP>(
  bundle: SceneBundle<P, S, PP>,
  props: Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
) {
  return <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />;
}
