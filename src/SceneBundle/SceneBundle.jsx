import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import * as actions from "./redux/actions";
import { connect } from "react-redux";

class SceneBundle extends Component {
  componentWillMount() {
    this.state = {
      isSceneBundleValid: false,
      OldPlayingScene: this.props.PlayingScene
    };
    let {
      asyncSceneComponent,
      SceneComponent,
      state,
      reducer,
      saga,
      match,
      location
    } = this.props;
    this.loadScene(
      asyncSceneComponent,
      SceneComponent,
      state,
      reducer,
      saga,
      match,
      location
    );
  }

  checkAndStartPlay(props, nextProps) {
    if (
      this.state.OldPlayingScene !== nextProps.PlayingScene ||
      props.sceneNo !== nextProps.sceneNo
    ) {
      this.setState(
        {
          isSceneBundleValid: true,
          OldPlayingScene: nextProps.PlayingScene
        },
        () => {
          this.props.sceneStartPlay();
        }
      );
    }
  }

  componentWillUnmount() {
    this.setState({ isSceneContextValid: false }, () => {
      this.props.sceneStopPlay();
    });
  }

  componentWillReceiveProps(nextProps) {
    let {
      asyncSceneComponent,
      SceneComponent,
      state,
      reducer,
      saga,
      match,
      location
    } = nextProps;
    this.checkAndStartPlay(this.props, nextProps);
    if (
      asyncSceneComponent !== this.props.asyncSceneComponent ||
      SceneComponent !== this.props.SceneComponent ||
      saga !== this.props.saga ||
      reducer != this.props.reducer
    ) {
      this.setState(
        {
          isSceneBundleValid: false,
          sceneStartTime: sceneStartTime + 1
        },
        () =>
          this.loadScene(
            asyncSceneComponent,
            SceneComponent,
            state,
            reducer,
            saga,
            match,
            location
          )
      );
    }
  }

  loadScene(
    asyncSceneComponent,
    SceneComponent,
    state,
    reducer,
    saga,
    match,
    location
  ) {
    this.props.sceneLoadStart();
    if (SceneComponent) {
      this.props.ArenaLoadScene(
        SceneComponent,
        state,
        reducer,
        saga,
        match,
        location,
        SceneComponent === this.state.OldPlayingScene
      );
      this.props.sceneLoadEnd();
      return;
    }
    if (asyncSceneComponent) {
      asyncSceneComponent.then(SceneComponentA => {
        SceneComponentA = SceneComponentA.default
          ? SceneComponentA.default
          : SceneComponentA;
        this.props.ArenaLoadScene(
          SceneComponentA,
          state,
          reducer,
          saga,
          match,
          location,
          SceneComponentA === this.state.OldPlayingScene
        );
        this.props.sceneLoadEnd();
      });
      return;
    }
    throw new Error(
      "props asyncSceneComponent and SceneComponent can not be both null"
    );
  }

  render() {
    let { PlayingScene, SceneLoadingComponent } = this.props;
    if (this.state.isSceneBundleValid) {
      return <PlayingScene />;
    } else {
      return <SceneLoadingComponent />;
    }
  }
}

SceneBundle.propTypes = {
  asyncSceneComponent: PropTypes.any,
  SceneComponent: PropTypes.any,
  state: PropTypes.object,
  reducer: PropTypes.object,
  saga: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  SceneLoadingComponent: PropTypes.any
};

function mapStateToProps(state) {
  return {
    PlayingScene: state.arena.PlayingScene,
    sceneNo: state.arena.sceneNo
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(SceneBundle)
);
