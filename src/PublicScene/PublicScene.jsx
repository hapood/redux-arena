import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import SceneBundle from "../SceneBundle";
import SceneLoading from "../SceneLoading";

class PublicScene extends Component {
  render() {
    let {
      asyncSceneBundle,
      sceneBundle,
      exact,
      strict,
      path,
      SceneLoadingComponent
    } = this.props;
    return (
      <Route
        exact={exact}
        path={path}
        strict={strict}
        component={() =>
          <SceneBundle
            {...{
              asyncSceneBundle,
              sceneBundle,
              SceneLoadingComponent
            }}
          />}
      />
    );
  }
}
PublicScene.propTypes = {
  asyncSceneBuldle: PropTypes.any,
  scene: PropTypes.any,
  SceneLoadingComponent: PropTypes.any,
  exact: PropTypes.bool,
  path: PropTypes.string,
  strict: PropTypes.bool
};

PublicScene.defaultProps = {
  SceneLoadingComponent: SceneLoading,
  exact: true
};

export default PublicScene;
