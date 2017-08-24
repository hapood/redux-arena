import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  componentWillMount() {
    this.state = {
      isSceneBundleValid: false
    };
    this.loadScene(this.props.sceneBundle, this.props.asyncSceneBundle);
  }

  componentWillUnmount() {
    let props = this.props;
    this.setState({ isSceneBundleValid: false }, () => {
      this.props.sceneStopPlay(this.props.arenaSwitchReducerKey);
    });
    this.props.clearSceneRedux(
      this.props.arenaSwitchReducerKey,
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
          this.props.sceneStartPlay(this.props.arenaSwitchReducerKey);
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
          this.loadScene(sceneBundle, asyncSceneBundle)
        );
      } else {
        this.loadScene(sceneBundle, asyncSceneBundle);
      }
    }
    if (nextProps.PlayingScene == null) {
      this.setState({
        isSceneBundleValid: false
      });
    }
  }

  loadScene(sceneBundle, asyncSceneBundle) {
    if (sceneBundle) {
      let payload = [this.props.arenaSwitchReducerKey];
      this.props.sceneLoadStart(...payload);
      this.props.arenaSwitchLoadScene(
        this.props.arenaSwitchReducerKey,
        sceneBundle
      );
      this.props.sceneLoadEnd(...payload);
      return;
    } else if (asyncSceneBundle) {
      this.props.sceneLoadStart(this.props.arenaSwitchReducerKey);
      this.props.arenaLoadAsyncScene(
        this.props.arenaSwitchReducerKey,
        asyncSceneBundle
      );
      return;
    }
    throw new Error(
      "prop asyncSceneBundle and sceneBundle can not be both null"
    );
  }

  render() {
    let { PlayingScene, SceneLoadingComponent } = this.props;
    let {
      match,
      location,
      history,
      arenaSwitchLocation,
      arenaSwitchMatch
    } = this.props;
    if (this.state.isSceneBundleValid) {
      return (
        <PlayingScene
          {...{
            match,
            location,
            history,
            arenaSwitchLocation,
            arenaSwitchMatch
          }}
        />
      );
    } else {
      return SceneLoadingComponent ? <SceneLoadingComponent /> : <div />;
    }
  }
}

SceneBundle.propTypes = {
  asyncSceneBundle: PropTypes.any,
  sceneBundle: PropTypes.any,
  location: PropTypes.object,
  computedMatch: PropTypes.object,
  match: PropTypes.object,
  showSwitchingLoading: PropTypes.bool,
  SceneLoadingComponent: PropTypes.any
};
