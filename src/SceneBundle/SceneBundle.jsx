import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  static contextTypes = {
    sceneSwitchKey: PropTypes.string,
    store: PropTypes.any
  };

  componentWillMount() {
    
    console.log('componentWillMount')
    this.state = {
      isSceneBundleValid: false,
      OldPlayingScene: this.props.PlayingScene,
      sceneNo: this.props.sceneNo,
      reduxInfoPromise: null
    };
    this.loadScene(
      this.props.asyncSceneBundle,
      this.props.sceneBundle,
      this.props.match,
      this.props.location
    );
  }

  componentWillUnmount() {
    let props = this.props;
    // this.setState({ isSceneContextValid: false }, () => {
    //   this.props.sceneStopPlay(
    //     this.context.sceneSwitchKey,
    //     props.match,
    //     props.location,
    //     props.sceneBundle,
    //     props.sceneBundle ? null : props.asyncSceneBundle
    //   );
    // });
    // this.props.clearSceneRedux(this.state.reduxInfoPromise);
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
            props.match,
            props.location,
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
    let { asyncSceneBundle, sceneBundle, match, location } = nextProps;
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
        () => this.loadScene(asyncSceneBundle, sceneBundle, match, location)
      );
    }
  }

  loadScene(asyncSceneBundle, sceneBundle, match, location) {
    if (sceneBundle) {
      let payload = [this.context.sceneSwitchKey, match, location, sceneBundle];
      this.props.sceneLoadStart(...payload);
      this.state.reduxInfoPromise = new Promise(resolve =>
        this.props.SceneSwitchLoadScene(
          this.context.sceneSwitchKey,
          sceneBundle,
          match,
          location,
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
        match,
        location,
        null,
        asyncSceneBundle
      );
      this.state.reduxInfoPromise = new Promise(resolve =>
        this.props.arenaLoadAsyncScene(
          this.context.sceneSwitchKey,
          asyncSceneBundle,
          match,
          location,
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
    if (this.state.isSceneBundleValid) {
      return <PlayingScene />;
    } else {
      return <div />;
    }
  }
}

SceneBundle.propTypes = {
  asyncSceneBundle: PropTypes.any,
  sceneBundle: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  SceneLoadingComponent: PropTypes.any
};
