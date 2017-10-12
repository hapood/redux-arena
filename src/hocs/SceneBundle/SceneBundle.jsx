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

  componentWillMount() {
    let loadedPromise = new Promise(resolve =>
      this.props.arenaLoadScene(
        this.props.parentArenaReducerDict,
        this.props.sceneBundle,
        true,
        resolve
      )
    );
    this.setState({
      isSceneBundleValid: false,
      loadedPromise
    });
  }

  checkAndStartPlay(props, nextProps) {
    if (
      nextProps.PlayingScene != null &&
      nextProps.PlayingScene !== props.PlayingScene
    ) {
      this.setState({
        isSceneBundleValid: true
      });
    }
  }

  componentDidMount() {
    this.checkAndStartPlay({}, this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isSceneBundleValid === false) {
      this.checkAndStartPlay(this.props, nextProps);
    }
    let { sceneBundle } = nextProps;
    if (sceneBundle !== this.props.sceneBundle) {
      this.state.loadedPromise.then(() => {
        let loadedPromise = new Promise(resolve =>
          nextProps.arenaLoadScene(
            nextProps.parentArenaReducerDict,
            nextProps.sceneBundle,
            false,
            resolve
          )
        );
        this.setState({
          loadedPromise
        });
      });
    }
  }

  render() {
    let { PlayingScene, sceneProps } = this.props;
    if (this.state.isSceneBundleValid) {
      return <PlayingScene {...sceneProps} />;
    } else {
      return <div />;
    }
  }
}
