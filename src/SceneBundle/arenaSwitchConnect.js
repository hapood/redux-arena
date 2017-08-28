import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from "./redux/actions";
import SceneBundle from "./SceneBundle";

export default function arenaSwitchConnect(arenaReducerDict) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    let reducerKey = arenaReducerDict._curSwitch.reducerKey;
    return {
      PlayingScene: state[reducerKey].PlayingScene,
      curSceneBundle: state[reducerKey].curSceneBundle,
      reduxInfo: state[reducerKey].reduxInfo,
      newArenaReducerDict: state[reducerKey].newArenaReducerDict,
      parentArenaReducerDict: arenaReducerDict
    };
  };

  let wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(
    SceneBundle
  );

  wrappedComponent.displayName = `ArenaSwitchConnect({reducerKey:${arenaReducerDict
    ._curSwitch.reducerKey}})`;
  return wrappedComponent;
}
