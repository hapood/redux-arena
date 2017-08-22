import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from "./redux/actions";
import SceneBundle from "./SceneBundle";

export default function sceneSwitchConnect(sceneSwitchReducerKey) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    return {
      PlayingScene: state[sceneSwitchReducerKey].PlayingScene,
      curSceneBundle: state[sceneSwitchReducerKey].curSceneBundle,
      reduxInfo: state[sceneSwitchReducerKey].reduxInfo,
      sceneSwitchReducerKey: sceneSwitchReducerKey
    };
  };

  let wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(
    SceneBundle
  );

  wrappedComponent.displayName = `SceneSwitchConnect({${sceneSwitchReducerKey}})`;
  return wrappedComponent;
}
