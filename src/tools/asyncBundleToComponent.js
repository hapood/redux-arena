import React, { Component } from "react";
import ArenaScene from "../hocs/ArenaScene";

export default function(asyncBundle, hocProps) {
  let WrapperClass = class extends Component {
    static displayName = "ScenePropsProxy";
    render() {
      return (
        <ArenaScene
          asyncSceneBundle={asyncBundle}
          sceneProps={this.props}
          {...hocProps}
        />
      );
    }
  };
  return WrapperClass;
}
