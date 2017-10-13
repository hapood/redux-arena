import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./actions";
import SceneBundle from "./SceneBundle";

export default function arenaCurtainConnect(reducerKey, clearCurtain) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    return {
      PlayingScene: state[reducerKey].PlayingScene,
      curSceneBundle: state[reducerKey].curSceneBundle,
      reduxInfo: state[reducerKey].reduxInfo,
      mutableObj: state[reducerKey].mutableObj,
      clearCurtain
    };
  };

  let ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(
    SceneBundle
  );

  ConnectedComponent.displayName = `ArenaCurtainConnect({reducerKey:${reducerKey}})`;
  return ConnectedComponent;
}
