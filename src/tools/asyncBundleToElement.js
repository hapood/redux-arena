import React, { Component } from "react";
import ArenaScene from "../hocs/ArenaScene";

export default function(asyncBundle, props, hocProps) {
  return (
    <ArenaScene
      asyncSceneBundle={asyncBundle}
      sceneProps={props}
      {...hocProps}
    />
  );
}
