import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SceneBundle extends Component {
  componentWillMount() {
    console.log(123)
    let initEmptyPromise = Promise.resolve({});
    this.state = {
      isSceneBundleValid: false,
      OldPlayingScene: this.props.PlayingScene,
      sceneNo: this.props.sceneNo,
      reduxInfoPromise: initEmptyPromise,
      obsoleteReduxInfoPromise: initEmptyPromise
    };
    this.state.reduxInfoPromise = new Promise(resolveReduxInfo => {
      this.state.obsoleteReduxInfoPromise = new Promise(
        resolveObsoleteReduxInfo => {
          this.loadScene(
            this.props.sceneBundle,
            this.props.asyncSceneBundle,
            this.props.curSceneBundle,
            this.state.reduxInfoPromise,
            resolveReduxInfo,
            resolveObsoleteReduxInfo
          );
        }
      );
    });
  }

  componentWillUnmount() {
    let props = this.props;
    this.setState({ isSceneContextValid: false }, () => {
      this.props.sceneStopPlay(
        this.props.sceneSwitchReducerKey,
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
            this.props.sceneSwitchReducerKey,
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

  startUpdatingScene = (asyncSceneBundle, sceneBundle, nextProps) => {
    let { reduxInfoPromise, obsoleteReduxInfoPromise } = this.state;
    nextProps.clearSceneRedux(obsoleteReduxInfoPromise);
    this.state.reduxInfoPromise = new Promise(resolveReduxInfo => {
      this.state.obsoleteReduxInfoPromise = new Promise(
        resolveObsoleteReduxInfo => {
          this.loadScene(
            sceneBundle,
            asyncSceneBundle,
            nextProps.curSceneBundle,
            reduxInfoPromise,
            resolveReduxInfo,
            resolveObsoleteReduxInfo
          );
        }
      );
    });
  };

  componentWillReceiveProps(nextProps) {
    let { asyncSceneBundle, sceneBundle } = nextProps;
    this.checkAndStartPlay(this.state, nextProps);
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle
    ) {
      if (nextProps.showSwitchingLoading) {
        this.setState(
          {
            isSceneBundleValid: false
          },
          this.startUpdatingScene(asyncSceneBundle, sceneBundle, nextProps)
        );
      } else {
        this.startUpdatingScene(asyncSceneBundle, sceneBundle, nextProps);
      }
    }
  }

  loadScene(
    sceneBundle,
    asyncSceneBundle,
    curSceneBundle,
    reduxInfoPromise,
    resolveReduxInfo,
    resolveObsoleteReduxInfo
  ) {
    if (sceneBundle) {
      let payload = [
        this.props.sceneSwitchReducerKey,
        sceneBundle,
        reduxInfoPromise
      ];
      this.props.sceneLoadStart(...payload);
      this.props.sceneSwitchLoadScene(
        this.props.sceneSwitchReducerKey,
        sceneBundle,
        this.state.OldPlayingScene,
        this.state.sceneNo,
        curSceneBundle,
        reduxInfoPromise,
        resolveReduxInfo,
        resolveObsoleteReduxInfo
      );
      this.props.sceneLoadEnd(...payload);
      return;
    } else if (asyncSceneBundle) {
      this.props.sceneLoadStart(
        this.props.sceneSwitchReducerKey,
        null,
        asyncSceneBundle,
        reduxInfoPromise
      );
      this.props.arenaLoadAsyncScene(
        this.props.sceneSwitchReducerKey,
        asyncSceneBundle,
        this.state.OldPlayingScene,
        this.state.sceneNo,
        curSceneBundle,
        reduxInfoPromise,
        resolveReduxInfo,
        resolveObsoleteReduxInfo
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
