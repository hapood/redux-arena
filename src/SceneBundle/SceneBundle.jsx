import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  static contextTypes = {
    sceneSwitchKey: PropTypes.string,
    store: PropTypes.any
  };

  componentWillMount() {
    this.state = {
      isSceneBundleValid: false,
      OldPlayingScene: this.props.PlayingScene,
      sceneNo: this.props.sceneNo
    };
    this.loadScene(
      this.props.sceneBundle,
      this.props.asyncSceneBundle,
      this.props.curSceneBundle,
      this.props.reduxInfo
    );
  }

  componentWillUnmount() {
    let props = this.props;
    this.setState({ isSceneContextValid: false }, () => {
      this.props.sceneStopPlay(
        this.context.sceneSwitchKey,
        props.sceneBundle,
        props.sceneBundle ? null : props.asyncSceneBundle
      );
    });
    this.props.clearSceneRedux(this.props.reduxInfo);
  }

  checkAndStartPlay(state, props) {
    if (
      state.OldPlayingScene !== props.PlayingScene ||
      state.sceneNo !== props.sceneNo
    ) {
      this.setState(
        {
          isSceneBundleValid: true,
          OldPlayingScene: props.PlayingScene,
          sceneNo: props.sceneNo
        },
        () => {
          this.props.sceneStartPlay(
            this.context.sceneSwitchKey,
            props.sceneBundle,
            props.sceneBundle ? null : props.asyncSceneBundle
          );
        }
      );
    }
  }

  componentDidMount() {
    this.checkAndStartPlay(this.state, this.props);
  }

  componentWillReceiveProps(nextProps) {
    let { asyncSceneBundle, sceneBundle } = nextProps;
    this.checkAndStartPlay(this.state, nextProps);
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle
    ) {
      this.setState(
        {
          isSceneBundleValid: false
        },
        () =>
          this.loadScene(
            sceneBundle,
            asyncSceneBundle,
            nextProps.curSceneBundle,
            nextProps.reduxInfo
          )
      );
    }
  }

  loadScene(sceneBundle, asyncSceneBundle, curSceneBundle, reduxInfo) {
    if (sceneBundle) {
      let payload = [this.context.sceneSwitchKey, sceneBundle, reduxInfo];
      this.props.sceneLoadStart(...payload);
      this.props.SceneSwitchLoadScene(
        this.context.sceneSwitchKey,
        sceneBundle,
        this.state.OldPlayingScene,
        this.state.sceneNo,
        curSceneBundle,
        reduxInfo
      );
      this.props.sceneLoadEnd(...payload);
      return;
    } else if (asyncSceneBundle) {
      this.props.sceneLoadStart(
        this.context.sceneSwitchKey,
        null,
        asyncSceneBundle,
        reduxInfo
      );
      this.props.arenaLoadAsyncScene(
        this.context.sceneSwitchKey,
        asyncSceneBundle,
        this.state.OldPlayingScene,
        this.state.sceneNo,
        curSceneBundle,
        reduxInfo
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
      sceneSwitchLocation,
      sceneSwitchMatch
    } = this.props;
    if (this.state.isSceneBundleValid) {
      return (
        <PlayingScene
          {...{
            match,
            location,
            history,
            sceneSwitchLocation,
            sceneSwitchMatch
          }}
        />
      );
    } else {
      return <div />;
    }
  }
}

SceneBundle.propTypes = {
  asyncSceneBundle: PropTypes.any,
  sceneBundle: PropTypes.any,
  location: PropTypes.object,
  computedMatch: PropTypes.object,
  match: PropTypes.object,
  SceneLoadingComponent: PropTypes.any
};
