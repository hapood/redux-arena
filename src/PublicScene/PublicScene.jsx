import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import SceneBundle from "../SceneBundle";
import SceneLoading from "../SceneLoading";

class PublicScene extends Component {
  render() {
    let {
      asyncSceneComponent,
      SceneComponent,
      state,
      reducer,
      saga,
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
              asyncSceneComponent,
              SceneComponent,
              state,
              reducer,
              saga,
              SceneLoadingComponent
            }}
          />}
      />
    );
  }
}
PublicScene.propTypes = {
  asyncSceneComponent: PropTypes.any,
  SceneComponent: PropTypes.any,
  state: PropTypes.object,
  reducer: PropTypes.object,
  saga: PropTypes.object,
  SceneLoadingComponent: PropTypes.any,
  exact: PropTypes.bool,
  path: PropTypes.string,
  strict: PropTypes.bool
};

PublicScene.defaultProps = {
  SceneLoadingComponent: SceneLoading
};

export default PublicScene;
