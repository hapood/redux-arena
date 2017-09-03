import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  static propTypes = {
    asyncSceneBundle: PropTypes.any,
    sceneBundle: PropTypes.object,
    sceneProps: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    showSwitchingLoading: PropTypes.bool,
    SceneLoadingComponent: PropTypes.any
  };

  static childContextTypes = {
    arenaReducerDict: PropTypes.object
  };

  getChildContext() {
    return { arenaReducerDict: this.props.reduxInfo.arenaReducerDict };
  }

  componentWillMount() {
    this.state = {
      isSceneBundleValid: false
    };
    this.loadScene(this.props);
  }

  componentWillUnmount() {
    let props = this.props;
    this.setState({ isSceneBundleValid: false }, () => {
      this.props.sceneStopPlay(
        this.props.parentArenaReducerDict._curSwitch.reducerKey,
        this.props.sceneBundle,
        this.props.asyncSceneBundle
      );
    });
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
          nextProps.sceneStartPlay(
            nextProps.parentArenaReducerDict._curSwitch.reducerKey,
            nextProps.sceneBundle,
            nextProps.asyncSceneBundle
          );
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
    let payload = [
      props.parentArenaReducerDict._curSwitch.reducerKey,
      props.sceneBundle,
      props.asyncSceneBundle
    ];
    if (props.sceneBundle) {
      setImmediate(() => {
        props.sceneLoadStart(...payload);
        props.arenaLoadScene(props.parentArenaReducerDict, props.sceneBundle);
        props.sceneLoadEnd(...payload);
      });
    } else if (props.asyncSceneBundle) {
      setImmediate(() => {
        props.sceneLoadStart(...payload);
        props.arenaLoadAsyncScene(
          props.parentArenaReducerDict,
          props.asyncSceneBundle
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
    let { match, location, history } = this.props;
    if (this.state.isSceneBundleValid) {
      return (
        <PlayingScene
          {...{
            match,
            location,
            history,
            ...sceneProps
          }}
        />
      );
    } else {
      return SceneLoadingComponent ? <SceneLoadingComponent /> : <div />;
    }
  }
}
