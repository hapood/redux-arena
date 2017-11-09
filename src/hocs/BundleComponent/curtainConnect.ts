import { ComponentClass, StatelessComponent } from "react";
import {
  bindActionCreators,
  Dispatch,
  ActionCreator,
  ActionCreatorsMapObject,
  AnyAction
} from "redux";
import { connect } from "react-redux";
import actions from "./actions";
import BundleComponent from "./BundleComponent";
import { Props, BaseProps, CurtainLoadScene } from "./types";

export default function curtainConnect(
  reducerKey: string,
  clearCurtain: () => void
) {
  let mapDispatchToProps = (
    dispatch: Dispatch<any>
  ): { curtainLoadScene: CurtainLoadScene<any, any, any> } => {
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

  let ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(
    BundleComponent
  );

  ConnectedComponent.displayName = `curtainConnect({reducerKey:${reducerKey}})`;
  return ConnectedComponent;
}
