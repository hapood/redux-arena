import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  static propTypes = {
    asyncSceneBundle: PropTypes.any,
    sceneBundle: PropTypes.object,
    sceneProps: PropTypes.object,
    isNotifyOn: PropTypes.bool,
    notifyData: PropTypes.object,
    showSwitchingLoading: PropTypes.bool,
    SceneLoadingComponent: PropTypes.any
  };

  static defaultProps = {
    isNotifyOn: false
  };

  static childContextTypes = {
    arenaReducerDict: PropTypes.object,
    routerSwitchReducerKey: PropTypes.string
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
    this.loadScene(this.props);
  }

  componentWillUnmount() {
    let props = this.props;
    if (this.props.isNotifyOn) {
      this.props.sceneStopPlay(
        this.props.parentArenaReducerDict,
        this.props.sceneBundle,
        this.props.asyncSceneBundle,
        this.props.notifyData
      );
    }
    this.props.clearSceneRedux(
      this.props.parentArenaReducerDict._curSwitch.reducerKey,
      this.props.reduxInfo
    );
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
      if (nextProps.showSwitchingLoading) {
        this.setState(
          {
            isSceneBundleValid: false
          },
          this.loadScene(nextProps)
        );
      } else {
        this.loadScene(nextProps);
      }
    }
    if (nextProps.PlayingScene == null) {
      this.setState({
        isSceneBundleValid: false
      });
    }
  }

  loadScene(props) {
    if (props.isNotifyOn) {
      props.sceneLoadStart(
        props.parentArenaReducerDict,
        props.sceneBundle,
        props.asyncSceneBundle,
        props.notifyData
      );
    }
    if (props.sceneBundle) {
      setImmediate(() => {
        props.arenaLoadScene(
          props.parentArenaReducerDict,
          props.sceneBundle,
          props.notifyData
        );
      });
    } else if (props.asyncSceneBundle) {
      setImmediate(() => {
        props.arenaLoadAsyncScene(
          props.parentArenaReducerDict,
          props.asyncSceneBundle,
          props.notifyData
        );
      });
    } else {
      throw new Error(
        "props asyncSceneBundle and sceneBundle can not be both null"
      );
    }
  }

  render() {
    let { PlayingScene, SceneLoadingComponent, sceneProps } = this.props;
    if (this.state.isSceneBundleValid) {
      return <PlayingScene {...sceneProps} />;
    } else {
      return SceneLoadingComponent ? <SceneLoadingComponent /> : <div />;
    }
  }
}
