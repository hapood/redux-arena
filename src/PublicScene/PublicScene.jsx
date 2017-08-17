import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import SceneLoading from "../SceneLoading";
import { arenaConnect } from "../SceneBundle";

class PublicScene extends Component {
  static contextTypes = {
    sceneSwitchKey: PropTypes.string
  };

  static propTypes = {
    asyncSceneBuldle: PropTypes.any,
    scene: PropTypes.any,
    SceneLoadingComponent: PropTypes.any,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    SceneLoadingComponent: SceneLoading,
    exact: true
  };

  componentWillMount() {
    let { asyncSceneBundle, sceneBundle, SceneLoadingComponent } = this.props;
    this.state = {
      wrappedSceneBundle: arenaConnect(
        asyncSceneBundle,
        sceneBundle,
        SceneLoadingComponent,
        this.context.sceneSwitchKey
      )
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { asyncSceneBundle, sceneBundle, SceneLoadingComponent } = nextProps;
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      nextContext.sceneSwitchKey !== this.context.sceneSwitchKey
    ) {
      this.state.wrappedSceneBundle = arenaConnect(
        asyncSceneBundle,
        sceneBundle,
        SceneLoadingComponent,
        nextContext.sceneSwitchKey
      );
    }
  }

  render() {
    let { exact, strict, path } = this.props;
    return (
      <Route
        exact={exact}
        path={path}
        strict={strict}
        component={this.state.wrappedSceneBundle}
      />
    );
  }
}
export default PublicScene;
