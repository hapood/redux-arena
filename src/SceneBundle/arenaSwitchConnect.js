import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from "./redux/actions";
import SceneBundle from "./SceneBundle";

export default function arenaSwitchConnect(arenaSwitchReducerKey) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    return {
      PlayingScene: state[arenaSwitchReducerKey].PlayingScene,
      curSceneBundle: state[arenaSwitchReducerKey].curSceneBundle,
      reduxInfo: state[arenaSwitchReducerKey].reduxInfo,
      arenaSwitchReducerKey: arenaSwitchReducerKey
    };
  };

  let wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(
    SceneBundle
  );

  wrappedComponent.displayName = `ArenaSwitchConnect({reducerKey:${arenaSwitchReducerKey}})`;
  return wrappedComponent;
}
