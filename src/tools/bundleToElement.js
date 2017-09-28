import React, { Component } from "react";
import ArenaScene from "../hocs/ArenaScene";

export default function(bundle, props, hocProps) {
  return <ArenaScene sceneBundle={bundle} sceneProps={props} {...hocProps} />;
}
