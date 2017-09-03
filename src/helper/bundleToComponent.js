import React from "react";
import SoloScene from "../hocs/SoloScene";

export default function(bundle) {
  return props => <SoloScene sceneBundle={bundle} sceneProps={props} />;
}
