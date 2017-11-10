import * as React from "react";
import { ActionCreatorsMapObject } from "redux";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import { SceneBundle } from "../core";
import { Omit } from "./types";

export default function<P extends PP, S, A extends ActionCreatorsMapObject, PP>(
  bundle: SceneBundle<P, S, A, PP>,
  props: Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
) {
  return <ArenaScene sceneBundle={bundle} sceneProps={props} {...extraProps} />;
}
