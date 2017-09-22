import React, { Component } from "react";
import SoloScene from "../hocs/SoloScene";

export default function(bundle) {
  let WrapperClass = class extends Component {
    static displayName = "ScenePropsProxyWrapper";
    render() {
      return <SoloScene sceneBundle={bundle} sceneProps={this.props} />;
    }
  };
  return WrapperClass;
}
