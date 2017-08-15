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
      OldPlayingScene: this.props.PlayingScene,
      sceneNo: this.props.sceneNo
    };
    this.loadScene(
      this.props.asyncSceneBundle,
      this.props.sceneBundle,
      this.props.match,
      this.props.location
    );
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
            props.match,
            props.location,
            props.sceneBundle,
            props.sceneBundle ? null : props.asyncSceneBundle
          );
        }
      );
    }
  }

  componentWillUnmount() {
    let props = this.props;
    this.setState({ isSceneContextValid: false }, () => {
      this.props.sceneStopPlay(
        props.match,
        props.location,
        props.sceneBundle,
        props.sceneBundle ? null : props.asyncSceneBundle
      );
    });
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
      this.setState(
        {
          isSceneBundleValid: false,
          sceneStartTime: sceneStartTime + 1
        },
        () => this.loadScene(asyncSceneBundle, sceneBundle, match, location)
      );
    }
  }

  loadScene(asyncSceneBundle, sceneBundle, match, location) {
    if (sceneBundle) {
      let payload = [match, location, sceneBundle];
      this.props.sceneLoadStart(...payload);
      this.props.ArenaLoadScene(
        sceneBundle,
        match,
        location,
        this.state.OldPlayingScene,
        this.state.sceneNo
      );
      this.props.sceneLoadEnd(...payload);
      return;
    } else if (asyncSceneBundle) {
      this.props.sceneLoadStart(match, location, null, asyncSceneBundle);
      this.props.arenaLoadAsyncScene(
        asyncSceneBundle,
        match,
        location,
        this.state.OldPlayingScene,
        this.state.sceneNo
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
      return <SceneLoadingComponent />;
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
