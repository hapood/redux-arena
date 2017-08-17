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
      sceneNo: this.props.sceneNo,
      reduxInfoPromise: null
    };
    this.loadScene(this.props.asyncSceneBundle, this.props.sceneBundle);
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
    this.props.clearSceneRedux(this.state.reduxInfoPromise);
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
      this.props.clearSceneRedux(this.state.reduxInfoPromise);
      this.setState(
        {
          isSceneBundleValid: false
        },
        () => this.loadScene(asyncSceneBundle, sceneBundle)
      );
    }
  }

  loadScene(asyncSceneBundle, sceneBundle) {
    if (sceneBundle) {
      let payload = [this.context.sceneSwitchKey, sceneBundle];
      this.props.sceneLoadStart(...payload);
      this.state.reduxInfoPromise = new Promise(resolve =>
        this.props.SceneSwitchLoadScene(
          this.context.sceneSwitchKey,
          sceneBundle,
          this.state.OldPlayingScene,
          this.state.sceneNo,
          resolve
        )
      );
      this.props.sceneLoadEnd(...payload);
      return;
    } else if (asyncSceneBundle) {
      this.props.sceneLoadStart(
        this.context.sceneSwitchKey,
        null,
        asyncSceneBundle
      );
      this.state.reduxInfoPromise = new Promise(resolve =>
        this.props.arenaLoadAsyncScene(
          this.context.sceneSwitchKey,
          asyncSceneBundle,
          this.state.OldPlayingScene,
          this.state.sceneNo,
          resolve
        )
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
