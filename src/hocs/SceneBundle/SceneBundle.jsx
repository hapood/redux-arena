import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  static propTypes = {
    sceneBundle: PropTypes.object.isRequired,
    sceneProps: PropTypes.object
  };

  static childContextTypes = {
    arenaReducerDict: PropTypes.object
  };

  getChildContext() {
    return {
      arenaReducerDict: this.props.reduxInfo.arenaReducerDict
    };
  }

  buildLoadScenePromise(arenaReducerDict, sceneBundle, isInitial) {
    if (isInitial) {
      return new Promise(resolve =>
        setImmediate(() =>
          this.props.arenaLoadScene(
            this.props.arenaReducerDict,
            this.props.sceneBundle,
            true,
            resolve
          )
        )
      );
    } else {
      return new Promise(resolve =>
        this.props.arenaLoadScene(
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

  componentWillReceiveProps(nextProps) {
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
