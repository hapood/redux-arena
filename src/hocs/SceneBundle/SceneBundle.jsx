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
    this.setState({
      isSceneBundleValid: false
    });
    this.loadScene(this.props, true);
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
    let { sceneBundle } = nextProps;
    if (sceneBundle !== this.props.sceneBundle) {
      this.loadScene(nextProps, false);
    }
  }

  loadScene(props, isInitial) {
    props.arenaLoadScene(
      props.parentArenaReducerDict,
      props.sceneBundle,
      isInitial
    );
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
