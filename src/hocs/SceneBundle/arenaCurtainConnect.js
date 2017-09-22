import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./actions";
import SceneBundle from "./SceneBundle";

export default function arenaCurtainConnect(arenaReducerDict) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    let reducerKey = arenaReducerDict._arenaCurtain.reducerKey;
    return {
      PlayingScene: state[reducerKey].PlayingScene,
      curSceneBundle: state[reducerKey].curSceneBundle,
      reduxInfo: state[reducerKey].reduxInfo,
      parentArenaReducerDict: arenaReducerDict
    };
  };

  let wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(
    SceneBundle
  );

  wrappedComponent.displayName = `arenaCurtainConnect({reducerKey:${arenaReducerDict
    ._arenaCurtain.reducerKey}})`;
  return wrappedComponent;
}
