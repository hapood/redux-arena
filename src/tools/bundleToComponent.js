import React, { Component } from "react";
import ArenaScene from "../hocs/ArenaScene";

export default function(bundle) {
  let WrapperClass = class extends Component {
    static displayName = "ScenePropsProxyWrapper";
    render() {
      return <ArenaScene sceneBundle={bundle} sceneProps={this.props} />;
    }
  };
  return WrapperClass;
}
