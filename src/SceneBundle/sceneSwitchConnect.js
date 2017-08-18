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
  sceneSwitchCtx,
  sceneSwitchLocation,
  sceneSwitchMatch
) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    return {
      PlayingScene: state[sceneSwitchCtx.reducerKey].PlayingScene,
      sceneNo: state[sceneSwitchCtx.reducerKey].sceneNo,
      curSceneBundle: state[sceneSwitchCtx.reducerKey].curSceneBundle,
      sceneSwitchReducerKey: sceneSwitchCtx.reducerKey
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
