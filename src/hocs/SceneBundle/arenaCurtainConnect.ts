import { Component, SFC } from "react";
import { bindActionCreators, Dispatch, ActionCreator } from "redux";
import { connect } from "react-redux";
import actions from "./actions";
import SceneBundle from "./SceneBundle";

export default function arenaCurtainConnect<P>(
  reducerKey: string,
  clearCurtain: () => void
): SFC<P> {
  let mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = (state: any) => {
    return {
      PlayingScene: state[reducerKey].PlayingScene,
      curSceneBundle: state[reducerKey].curSceneBundle,
      reduxInfo: state[reducerKey].reduxInfo,
      mutableObj: state[reducerKey].mutableObj,
      clearCurtain
    };
  };

  let ConnectedComponent: any = connect(mapStateToProps, mapDispatchToProps)(
    SceneBundle
  );

  ConnectedComponent.displayName = `ArenaCurtainConnect({reducerKey:${reducerKey}})`;
  return <SFC<P>>ConnectedComponent;
}
