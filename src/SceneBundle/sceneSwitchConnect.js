import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from "./redux/actions";
import SceneBundle from "./SceneBundle";

export default function sceneSwitchConnect(
  asyncSceneBundle,
  sceneBundle,
  SceneLoadingComponent,
  sceneSwitchKey,
  sceneSwitchLocation,
  sceneSwitchMatch
) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    return {
      PlayingScene: state[sceneSwitchKey].PlayingScene,
      sceneNo: state[sceneSwitchKey].sceneNo
    };
  };

  let wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(function(
    extraProps
  ) {
    return (
      <SceneBundle
        {...{
          asyncSceneBundle,
          sceneBundle,
          SceneLoadingComponent,
          mapStateToProps,
          sceneSwitchLocation,
          sceneSwitchMatch,
          ...extraProps
        }}
      />
    );
  });

  wrappedComponent.displayName = "SceneSwitchConnect";
  return wrappedComponent;
}
