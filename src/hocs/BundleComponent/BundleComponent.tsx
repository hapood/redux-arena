import * as React from "react";
import * as PropTypes from "prop-types";
import { ReducerDict, SceneBundle } from "../../core";
import {
  BundleComponentConnectedProps,
  BundleComponentProps,
  BundleComponentState
} from "./types";

export default class BundleComponent extends React.Component<
  BundleComponentConnectedProps & BundleComponentProps,
  BundleComponentState
> {
  static childContextTypes = {
    arenaReducerDict: PropTypes.object
  };

  getChildContext() {
    return {
      arenaReducerDict:
        this.props.reduxInfo && this.props.reduxInfo.arenaReducerDict
    };
  }

  buildLoadScenePromise(
    arenaReducerDict: ReducerDict,
    sceneBundle: SceneBundle,
    isInitial: any
  ): Promise<null> {
    if (isInitial) {
      return new Promise(resolve =>
        setImmediate(() =>
          this.props.curtainLoadScene(
            this.props.arenaReducerDict,
            this.props.sceneBundle,
            true,
            resolve
          )
        )
      );
    } else {
      return new Promise(resolve =>
        this.props.curtainLoadScene(
          this.props.arenaReducerDict,
          this.props.sceneBundle,
          true,
          resolve
        )
      );
    }
  }

  componentWillMount() {
    let loadedPromise = this.buildLoadScenePromise(
      this.props.arenaReducerDict,
      this.props.sceneBundle,
      true
    );
    this.setState({
      loadedPromise
    });
  }

  componentWillReceiveProps(nextProps: BundleComponentProps) {
    let { sceneBundle } = nextProps;
    if (sceneBundle !== this.props.sceneBundle) {
      this.state.loadedPromise.then(() => {
        let loadedPromise = this.buildLoadScenePromise(
          nextProps.arenaReducerDict,
          nextProps.sceneBundle,
          false
        );
        this.setState({
          loadedPromise
        });
      });
    }
  }

  componentWillUnmount() {
    this.props.clearCurtain();
    this.props.mutableObj.isObsolete = true;
  }

  render() {
    let { PlayingScene, sceneProps } = this.props;
    if (PlayingScene != null) {
      return <PlayingScene {...sceneProps} />;
    } else {
      return <div />;
    }
  }
}
