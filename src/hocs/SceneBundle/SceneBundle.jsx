import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  static propTypes = {
    asyncSceneBundle: PropTypes.any,
    sceneBundle: PropTypes.object,
    sceneProps: PropTypes.object,
    isNotifyOn: PropTypes.bool,
    notifyData: PropTypes.object
  };

  static defaultProps = {
    isNotifyOn: false
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
    this.state = {
      isSceneBundleValid: false
    };
    setImmediate(() => {
      this.loadScene(this.props, true);
    });
  }

  componentWillUnmount() {
    if (this.props.isNotifyOn) {
      this.props.sceneStopPlay(
        this.props.parentArenaReducerDict,
        this.props.sceneBundle,
        this.props.asyncSceneBundle,
        this.props.notifyData
      );
    }
  }

  checkAndStartPlay(props, nextProps) {
    if (
      nextProps.PlayingScene != null &&
      nextProps.PlayingScene !== props.PlayingScene
    ) {
      this.setState(
        {
          isSceneBundleValid: true
        },
        () => {
          if (nextProps.isNotifyOn) {
            nextProps.sceneStartPlay(
              nextProps.parentArenaReducerDict,
              nextProps.sceneBundle,
              nextProps.asyncSceneBundle,
              nextProps.notifyData
            );
          }
        }
      );
    }
  }

  componentDidMount() {
    this.checkAndStartPlay({}, this.props);
  }

  componentWillReceiveProps(nextProps) {
    let { asyncSceneBundle, sceneBundle } = nextProps;
    this.checkAndStartPlay(this.props, nextProps);
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle
    ) {
      this.loadScene(nextProps, false);
    }
    if (nextProps.PlayingScene == null) {
      this.setState({
        isSceneBundleValid: false
      });
    }
  }

  loadScene(props, isInitial) {
    if (props.isNotifyOn) {
      props.sceneLoadStart(
        props.parentArenaReducerDict,
        props.sceneBundle,
        props.asyncSceneBundle,
        props.notifyData,
        isInitial
      );
    }
    props.arenaLoadScene(
      props.parentArenaReducerDict,
      props.sceneBundle,
      props.asyncSceneBundle,
      props.notifyData,
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
