import { Component, SFC } from "react";
import { bindActionCreators, Dispatch, ActionCreator } from "redux";
import { connect } from "react-redux";
import actions from "./actions";
import BundleComponent from "./BundleComponent";
import { Props, BaseProps } from "./types";

export default function curtainConnect(
  reducerKey: string,
  clearCurtain: () => void
): SFC<Props> {
  let mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = (state: any): BaseProps => {
    return {
      PlayingScene: state[reducerKey].PlayingScene,
      curSceneBundle: state[reducerKey].curSceneBundle,
      reduxInfo: state[reducerKey].reduxInfo,
      mutableObj: state[reducerKey].mutableObj,
      clearCurtain
    };
  };

  let ConnectedComponent: any = connect(mapStateToProps, mapDispatchToProps)(
    BundleComponent
  );

  ConnectedComponent.displayName = `curtainConnect({reducerKey:${reducerKey}})`;
  return ConnectedComponent;
}
